namespace attendance1.Application.Services
{
    public class AuthService : BaseService, IAuthService
    {
        private readonly JwtSettings _jwtSettings;
        private readonly IValidateService _validateService;

        private readonly IUserRepository _userRepository;

        public AuthService(ILogger<AuthService> logger, IOptions<JwtSettings> jwtSettings, IValidateService validateService, IUserRepository userRepository, LogContext logContext)
            : base(logger, logContext)
        {
            _jwtSettings = jwtSettings.Value ?? throw new ArgumentNullException(nameof(jwtSettings));
            _validateService = validateService ?? throw new ArgumentNullException(nameof(validateService));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        }

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

        public async Task<Result<LoginResponseDto>> StudentLoginAsync(StudentLoginRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                var user = await _userRepository.GetUserByEmailAsync(requestDto.Email);
                if (user == null)
                    throw new KeyNotFoundException("User not found");

                if (!BCrypt.Net.BCrypt.Verify(requestDto.Password, user.UserPassword)) 
                    throw new InvalidOperationException("Incorrect password");
                
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
                if (existedStaffs == null)
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
                if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                    throw new InvalidOperationException("Invalid or expired refresh token");

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
