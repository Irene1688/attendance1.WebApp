using System.Threading.Tasks;

namespace attendance1.Application.Services
{
    public class AuthService : BaseService, IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly JwtSettings _jwtSettings;
        private readonly IValidateService _validateService;
        private readonly ICourseRepository _courseRepository;
        private readonly IUserRepository _userRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthService(ILogger<AuthService> logger, IConfiguration configuration, IOptions<JwtSettings> jwtSettings, IValidateService validateService, ICourseRepository courseRepository, IUserRepository userRepository, LogContext logContext, IHttpContextAccessor httpContextAccessor)
            : base(logger, logContext)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _jwtSettings = jwtSettings.Value ?? throw new ArgumentNullException(nameof(jwtSettings));
            _validateService = validateService ?? throw new ArgumentNullException(nameof(validateService));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _courseRepository = courseRepository ?? throw new ArgumentNullException(nameof(courseRepository));
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        }

        #region token generation
        private string GenerateAccessToken(UserDetail user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Role, user.AccRole ?? string.Empty),
                new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
                new Claim(ClaimTypes.NameIdentifier, user.StudentId ?? user.LecturerId ?? string.Empty),
                // new Claim("jti", Guid.NewGuid().ToString()), // jwt id
                // new Claim("iat", DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString()) // issued at
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var now = DateTime.UtcNow;
            var notBefore = now.AddSeconds(-30);
            var expires = now.AddHours(_jwtSettings.ExpiryInHours);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                notBefore: notBefore,
                expires: expires,
                signingCredentials: credentials);

            var accessToken = new JwtSecurityTokenHandler().WriteToken(token);
            return accessToken;
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            LogInfo("Refresh token generated");
            return Convert.ToBase64String(randomNumber);
        }

        private async Task<(string accessToken, string refreshToken)> HandleTokenGeneration(UserDetail user) 
        {
            var accessToken = GenerateAccessToken(user);
            var refreshToken = GenerateRefreshToken();

            var expiryTime = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpiryInDays);
            var isUpdated = await UpdateUserRefreshToken(user, refreshToken, expiryTime);

            if (!isUpdated)
                throw new Exception("Failed to update refresh token");
            return (accessToken, refreshToken);
        }

        private async Task<bool> UpdateUserRefreshToken(UserDetail user, string refreshToken, DateTime? expiryTime)
        {
            return await _userRepository.UpdateUserRefreshTokenAsync(user, refreshToken, expiryTime);
        }
        #endregion

        #region fingerprint generation
        private static string NormalizeUserAgent(string userAgent)
        {
            var pattern = @"\/\d+(\.\d+)*|\s+";
            return Regex.Replace(userAgent, pattern, "").ToLowerInvariant();
        }

        private static string NormalizeResolution(string resolution)
        {
            // 处理分辨率,允许小范围变化
            var parts = resolution.Split('x');
            if(parts.Length == 2 && int.TryParse(parts[0], out int width) && int.TryParse(parts[1], out int height))
            {
                // 将分辨率归类到最接近的标准分辨率
                return $"{RoundToNearest(width, 50)}x{RoundToNearest(height, 50)}";
            }
            return resolution;
        }

        private static int RoundToNearest(int value, int factor)
        {
            return ((value + factor / 2) / factor) * factor;
        }

        private int CalculateHammingDistance(string hash1, string hash2)
        {
            if (hash1.Length != hash2.Length)
            return -1;

            int distance = 0;
            for (int i = 0; i < hash1.Length; i++)
            {
                if (hash1[i] != hash2[i])
                {
                    distance++;
                }
            }
            return distance;
        }

        
        public string GenerateFingerprintHash(DeviceInfoDto deviceInfo, string studentId)
        {
            // 1. 规范化设备信息
            var normalizedInfo = new
            {
                //Fingerprint = deviceInfo.Fingerprint,
                StudentId = studentId,
                //UserAgent = NormalizeUserAgent(deviceInfo.UserAgent),
                Platform = deviceInfo.Platform.ToUpperInvariant(),
                Resolution = NormalizeResolution(deviceInfo.ScreenResolution),
                Language = deviceInfo.Language.ToLowerInvariant(),
                Timezone = deviceInfo.Timezone,
                HardwareConcurrency = deviceInfo.HardwareConcurrency,
                DeviceMemory = deviceInfo.DeviceMemory,
                MaxTouchPoints = deviceInfo.MaxTouchPoints,
                CanvaHash = deviceInfo.CanvasHash
            };

            var fingerprintData = JsonSerializer.Serialize(normalizedInfo);
            var salt = _configuration["Fingerprint:Salt"];
            var dataWithSalt = $"{fingerprintData}|{salt}";
            
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(dataWithSalt);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        private async Task<bool> ValidateFingerprint(string storedHash, DeviceInfoDto newDeviceInfo, string studentId)
        {
            var newHash = GenerateFingerprintHash(newDeviceInfo, studentId);
            if (storedHash == newHash) return true;
            int differences = CalculateHammingDistance(storedHash, newHash);
            if (differences <= 2 && differences != -1)
                return await _userRepository.UpdateFingerprintOfStudent(newHash, studentId);
            
            return false;
        }
        #endregion


        public async Task<Result<LoginResponseDto>> StudentLoginAsync(StudentLoginRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                var user = await _userRepository.GetUserByEmailAsync(requestDto.Email);
                if (user == null)
                    throw new KeyNotFoundException("User not found, please check your email and try again");

                if (!BCrypt.Net.BCrypt.Verify(requestDto.Password, user.UserPassword)) 
                    throw new InvalidOperationException("Incorrect password");

                var currentFingerprintHash = GenerateFingerprintHash(requestDto.DeviceInfo, user.StudentId ?? string.Empty);
                
                // 1. check if the device is already bound to another account
                var existingDevice = await _userRepository.GetDeviceByFingerprintHashAsync(currentFingerprintHash);
                if (existingDevice.BindDate != DateOnly.MinValue && existingDevice.StudentId != user.StudentId)
                    throw new UnauthorizedAccessException("This device is already bound to another account");

                // 2. check if the current user has already bound to a device
                var fingerprint = await _userRepository.GetFingerprintByStudentIdAsync(user.StudentId ?? string.Empty);
                bool isFirstLogin = false;
                if (fingerprint.BindDate == DateOnly.MinValue || string.IsNullOrEmpty(fingerprint.StudentId))
                {
                    isFirstLogin = true;
                    fingerprint = new StudentDevice
                    {
                        UserId = user.UserId,
                        StudentId = user.StudentId ?? string.Empty,
                        FingerprintHash = currentFingerprintHash,
                        BindDate = DateOnly.FromDateTime(DateTime.Now),
                        IsActive = true
                    };
                    var success = await _userRepository.SaveFingerprintOfStudentAsync(fingerprint);
                    if (!success)
                        throw new Exception($"Failed to bind your device to {user.StudentId} account, please try again later");
                }

                if (!isFirstLogin && !await ValidateFingerprint(fingerprint.FingerprintHash, requestDto.DeviceInfo, user.StudentId ?? string.Empty))
                    throw new UnauthorizedAccessException($"Login for {user.StudentId} failed. This account can only be accessed from your first-login device");

                var (accessToken, refreshToken) = await HandleTokenGeneration(user);
                
                return new LoginResponseDto 
                {
                    UserId = user.UserId,
                    Name = user.UserName ?? string.Empty,
                    Role = user.AccRole ?? string.Empty,
                    CampusId = user.StudentId ?? string.Empty,
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                };
            },
            "Failed to login",
            loginUserInfo: $"Login attempt for student email: {requestDto.Email}");
        }

        public async Task<Result<LoginResponseDto>> StaffLoginAsync(StaffLoginRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                var existedStaffs = await _userRepository.GetStaffByUsernameAsync(requestDto.Username, requestDto.Role.ToString());
                if (existedStaffs.Count <= 0)
                    throw new KeyNotFoundException("User not found");

                var loginUser = existedStaffs.FirstOrDefault(staff => BCrypt.Net.BCrypt.Verify(requestDto.Password, staff.UserPassword));
                if (loginUser == null)
                    throw new InvalidOperationException("Incorrect password");
                
                var (accessToken, refreshToken) = await HandleTokenGeneration(loginUser);
                
                return new LoginResponseDto
                {
                    UserId = loginUser.UserId,
                    Name = loginUser.UserName ?? string.Empty,
                    Role = loginUser.AccRole ?? string.Empty,
                    CampusId = loginUser.LecturerId ?? string.Empty,
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                };
            },
            "Failed to login",
            loginUserInfo: $"Login attempt for staff username: {requestDto.Username}, role: {requestDto.Role}");
        }

        public async Task<Result<LoginResponseDto>> RefreshAccessTokenAsync(RefreshTokenRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                var refreshToken = requestDto.RefreshToken;
                var user = await _userRepository.GetUserByRefreshTokenAsync(refreshToken);
                if (user == null)
                    throw new InvalidOperationException("Invalid or expired refresh token");

                if (user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                    throw new InvalidOperationException($"Invalid or expired refresh token for {user.StudentId ?? "the account"}");

                // check if need to rotate refresh token, if the expiry time is less than half of the refresh token expiry time
                var shouldRotateRefreshToken = user.RefreshTokenExpiryTime <=
                    DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpiryInDays / 2);

                var accessToken = GenerateAccessToken(user);
                var newRefreshToken = shouldRotateRefreshToken ? GenerateRefreshToken() : refreshToken;

                if (shouldRotateRefreshToken)
                {
                    var isUpdated = await UpdateUserRefreshToken(user, newRefreshToken, DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpiryInDays));
                    if (!isUpdated)
                        throw new Exception("Failed to update refresh token");
                }

                return new LoginResponseDto
                {
                    UserId = user.UserId,
                    Name = user.UserName ?? string.Empty,
                    Role = user.AccRole ?? string.Empty,
                    CampusId = user.StudentId ?? string.Empty,
                    AccessToken = accessToken,
                    RefreshToken = newRefreshToken
                };
            },
            "Failed to refresh token");
        }

        public async Task<Result<bool>> LogoutAsync(LogoutRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                var refreshToken = requestDto.RefreshToken;
                var accessToken = requestDto.AccessToken;
                var user = await _userRepository.GetUserByRefreshTokenAsync(refreshToken);
                if (user == null)
                    throw new KeyNotFoundException("User not found");

                var isUpdated = await UpdateUserRefreshToken(user, null, null);
                if (!isUpdated)
                    throw new Exception("Failed to remove token info in database");

                return true;
            }, "Failed to logout");
        }
    }
}
