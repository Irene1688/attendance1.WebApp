namespace attendance1.Application.Interfaces
{
    public interface IAccountService
    {
        /// <summary>
        /// to create admin account
        /// </summary>
        Task<Result<bool>> CreateAdminAsync(CreateAccountRequestDto requestDto);

        Task<Result<GetLecturerSelectionResponseDto>> GetLecturerSelectionAsync();

        /// <summary>
        /// For admin to get all lecturers with class in Lecturer Management module
        /// </summary>
        Task<Result<PaginatedResult<GetLecturerResponseDto>>> GetAllLecturerWithClassAsync(GetLecturerRequestDto requestDto);
        
        /// <summary>
        /// For admin to get all students with class in Student Management module
        /// </summary>
        Task<Result<PaginatedResult<GetStudentResponseDto>>> GetAllStudentWithClassAsync(GetStudentRequestDto requestDto);
        
        /// <summary>
        /// For admin to create new user
        /// </summary>
        Task<Result<bool>> CreateNewUserAsync(CreateAccountRequestDto requestDto);

        /// <summary>
        /// For admin to edit user
        /// </summary>
        Task<Result<bool>> EditUserAsync(EditProfileRequestDto requestDto);

        /// <summary>
        /// For admin to delete user
        /// </summary>
        Task<Result<bool>> DeleteUserAsync(DeleteRequestDto requestDto);

        /// <summary>
        /// For admin to delete multiple users
        /// </summary>
        Task<Result<bool>> MultipleDeleteUserAsync(List<DeleteRequestDto> requestDto);

        /// <summary>
        /// For admin to reset user password with default password (user's campus id lowercase)
        /// </summary>
        Task<Result<bool>> ResetPasswordAsync(DataIdRequestDto requestDto);

        /// <summary>
        /// For admin to reset student reset/unbound student device
        /// </summary>
        Task<Result<bool>> ResetFingerprintOfStudentAsync(DataIdRequestDto requestDto);
        
        /// <summary>
        /// For lecturer to create student accounts when adding multiple students
        /// </summary>
        Task<Result<bool>> CreateMultipleStudentAccountsAsync(List<CreateAccountRequestDto> requestDto, int programmeId);
        
        /// <summary>
        /// For lecturer to create student account when adding single student
        /// </summary>
        Task<Result<bool>> CreateSingleStudentAccountAsync(CreateAccountRequestDto requestDto);
    }
}