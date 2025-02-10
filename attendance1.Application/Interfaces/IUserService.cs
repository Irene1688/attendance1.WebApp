namespace attendance1.Application.Interfaces
{
    public interface IUserService
    {
        Task<Result<ViewProfileResponseDto>> ViewProfileAsync(ViewProfileRequestDto requestDto);
        Task<Result<bool>> EditProfileWithPasswordAsync(EditProfileWithPasswordRequestDto requestDto);
    }
}