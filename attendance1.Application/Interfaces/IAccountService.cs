namespace attendance1.Application.Interfaces
{
    public interface IAccountService
    {
        Task<Result<GetLecturerSelectionResponseDto>> GetLecturerSelectionAsync();
        Task<Result<PaginatedResult<GetLecturerResponseDto>>> GetAllLecturerWithClassAsync(GetLecturerRequestDto requestDto);
        Task<Result<PaginatedResult<GetStudentResponseDto>>> GetAllStudentWithClassAsync(GetStudentRequestDto requestDto);
        Task<Result<bool>> CreateNewUserAsync(CreateAccountRequestDto requestDto);
        Task<Result<bool>> EditUserAsync(EditProfileRequestDto requestDto);
        Task<Result<bool>> DeleteUserAsync(DeleteRequestDto requestDto);
        Task<Result<bool>> MultipleDeleteUserAsync(List<DeleteRequestDto> requestDto);
        Task<Result<bool>> ResetPasswordAsync(DataIdRequestDto requestDto);
    }
}