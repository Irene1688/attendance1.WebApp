namespace attendance1.Application.Interfaces
{
    public interface IUserService
    {
        Task<Result<bool>> CreateMultipleStudentAccountsAsync(List<CreateAccountRequestDto> requestDto, int programmeId);
        Task<Result<bool>> CreateSingleStudentAccountsAsync(CreateAccountRequestDto requestDto);
        Task<Result<ViewProfileResponseDto>> ViewProfileAsync(ViewProfileRequestDto requestDto);
        Task<Result<bool>> EditProfileWithPasswordAsync(EditProfileWithPasswordRequestDto requestDto);
        //Task<Result<bool>> EditProfileAsync(EditProfileRequestDto requestDto);
        //Task<Result<bool>> ChangePasswordAsync(EditPasswordRequestDto requestDto);
    }
}