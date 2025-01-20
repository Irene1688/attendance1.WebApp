namespace attendance1.Application.Interfaces
{
    public interface IAuthService
    {
        Task<Result<LoginResponseDto>> StudentLoginAsync(StudentLoginRequestDto requestDto);
        Task<Result<LoginResponseDto>> StaffLoginAsync(StaffLoginRequestDto requestDto);
        Task<Result<bool>> LogoutAsync(LogoutRequestDto requestDto);
        Task<Result<LoginResponseDto>> RefreshAccessTokenAsync(RefreshTokenRequestDto requestDto);
    }
}