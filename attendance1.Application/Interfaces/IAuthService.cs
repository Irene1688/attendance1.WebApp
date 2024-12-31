using attendance1.Application.Common.Response;
using attendance1.Application.DTOs.Admin;
using attendance1.Application.DTOs.Common;
using attendance1.Application.DTOs.Lecturer;

namespace attendance1.Application.Interfaces
{
    public interface IAuthService
    {
        Task<Result<LoginResponseDto>> LoginAsync(LoginRequestDto requestDto);
        Task<Result<bool>> LogoutAsync(LogoutRequestDto requestDto);
        Task<Result<LoginResponseDto>> RefreshAccessTokenAsync(RefreshTokenRequestDto requestDto);
    }
}