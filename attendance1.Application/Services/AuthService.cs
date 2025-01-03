using System.Security.Claims;
using attendance1.Application.Common.Response;
using attendance1.Application.Common.Settings;
using attendance1.Application.DTOs.Common;
using attendance1.Application.Interfaces;
using attendance1.Domain.Entities;
using attendance1.Domain.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using attendance1.Application.Common.Logging;
using Microsoft.AspNetCore.Http;

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
            var expires = now.AddHours(_jwtSettings.ExpiryInHours);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                notBefore: now,
                expires: expires,
                signingCredentials: credentials);

            var accessToken = new JwtSecurityTokenHandler().WriteToken(token);
            LogInfo("Access token generated");

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

        public async Task<Result<LoginResponseDto>> LoginAsync(LoginRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                var user = await _userRepository.GetUserByEmailAsync(requestDto.Email);
                if (user == null)
                    throw new Exception("User not found");

                if (!BCrypt.Net.BCrypt.Verify(requestDto.Password, user.UserPassword)) 
                    throw new Exception("Incorrect password");
                var accessToken = GenerateAccessToken(user);
                var refreshToken = GenerateRefreshToken();

                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpiryInDays);
                var isUpdated = await _userRepository.UpdateUserRefreshTokenAsync(user);
                if (!isUpdated)
                    throw new Exception("Failed to update refresh token");

                return new LoginResponseDto
                {
                    Name = user.UserName ?? string.Empty,
                    Role = user.AccRole ?? string.Empty,
                    CampusId = user.StudentId ?? string.Empty,
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                };
            },
            "Failed to login");
        }

        public async Task<Result<LoginResponseDto>> RefreshAccessTokenAsync(RefreshTokenRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                var refreshToken = requestDto.RefreshToken;
                var user = await _userRepository.GetUserByRefreshTokenAsync(refreshToken);
                if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                    throw new Exception("Invalid or expired refresh token");

                // check if need to rotate refresh token, if the expiry time is less than half of the refresh token expiry time
                var shouldRotateRefreshToken = user.RefreshTokenExpiryTime <= 
                    DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpiryInDays / 2);

                var accessToken = GenerateAccessToken(user);
                var newRefreshToken = shouldRotateRefreshToken ? GenerateRefreshToken() : refreshToken;

                if (shouldRotateRefreshToken)
                {
                    user.RefreshToken = newRefreshToken;
                    user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpiryInDays);
                    await _userRepository.UpdateUserRefreshTokenAsync(user);
                }

                return new LoginResponseDto
                {
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
                    throw new Exception("User not found");

                user.RefreshToken = null;
                user.RefreshTokenExpiryTime = null;
                await _userRepository.UpdateUserRefreshTokenAsync(user);

                LogInfo("Logout successful");

                return true;
            }, "Failed to logout");
        }
    }
}
