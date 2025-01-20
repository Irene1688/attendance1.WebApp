namespace attendance1.Application.Interfaces
{
    public interface IAdminService
    {
        Task<Result<AllTotalCountResponseDto>> GetAllTotalCountAsync();
        #region programme CRUD
        // Task<Result<GetProgrammeSelectionResponseDto>> GetProgrammeSelectionAsync();
        // Task<Result<bool>> CreateNewProgrammeAsync(CreateProgrammeRequestDto requestDto);
        // Task<Result<PaginatedResult<GetProgrammeResponseDto>>> GetAllProgrammeAsync(GetProgrammeRequestDto requestDto);
        // Task<Result<bool>> EditProgrammeAsync(EditProgrammeRequestDto requestDto);
        // Task<Result<bool>> DeleteProgrammeAsync(DeleteRequestDto requestDto);
        #endregion

        #region User Create & Edit (include Lecturer and Student)
        // Task<Result<bool>> CreateNewUserAsync(CreateAccountRequestDto requestDto);
        // Task<Result<bool>> EditUserAsync(EditProfileRequestDto requestDto);
        // Task<Result<bool>> DeleteUserAsync(DeleteRequestDto requestDto);
        // Task<Result<bool>> MultipleDeleteUserAsync(List<DeleteRequestDto> requestDto);
        // Task<Result<bool>> ResetPasswordAsync(DataIdRequestDto requestDto);
        #endregion

        #region View Lecturer & Student
        // Task<Result<GetLecturerSelectionResponseDto>> GetLecturerSelectionAsync();
        // Task<Result<PaginatedResult<GetLecturerResponseDto>>> GetAllLecturerWithClassAsync(GetLecturerRequestDto requestDto);
        // Task<Result<PaginatedResult<GetStudentResponseDto>>> GetAllStudentWithClassAsync(GetStudentRequestDto requestDto);
        #endregion

        #region Class CRUD
        // Task<Result<bool>> CreateNewCourseAsync(CreateCourseRequestDto requestDto);
        // Task<Result<PaginatedResult<GetCourseResponseDto>>> GetAllCourseAsync(GetCourseRequestDto requestDto);
        // Task<Result<bool>> EditCourseAsync(EditCourseRequestDto requestDto);
        // Task<Result<bool>> DeleteCourseAsync(DeleteRequestDto requestDto);
        // Task<Result<bool>> MultipleDeleteCourseAsync(List<DeleteRequestDto> requestDto);
        #endregion

        #region Students in Course CRUD
        // Task<Result<bool>> AddStudentsToCourseAndTutorialAsync(AddStudentsToCourseRequestDto requestDto);
        #endregion

        #region Attendance Record
        //Task<Result<PaginatedResult<GetAttendanceRecordByCourseIdResponseDto>>> GetAttendanceRecordByCourseIdAsync(GetAttendanceRecordByCourseIdRequestDto requestDto);
        #endregion


    }
}