namespace attendance1.Application.Interfaces
{
    public interface ICourseService
    {
        #region Course CRUD
        Task<Result<int>> CreateNewCourseAsync(CreateCourseRequestDto requestDto);
        Task<Result<PaginatedResult<GetCourseResponseDto>>> GetAllCourseAsync(GetCourseRequestDto requestDto);
        Task<Result<GetActiveCourseSelectionResponseDto>> GetActiveCourseSelectionByLecturerIdAsync(DataIdRequestDto requestDto);
        Task<Result<GetLecturerClassRequestDto>> GetActiveClassesOfLecturerAsync(DataIdRequestDto requestDto);
        Task<Result<GetCourseDetailsResponseDto>> GetCourseDetailsAsync(DataIdRequestDto requestDto);
        Task<Result<bool>> EditCourseAsync(EditCourseRequestDto requestDto);
        Task<Result<bool>> DeleteCourseAsync(DeleteRequestDto requestDto);
        Task<Result<bool>> MultipleDeleteCourseAsync(List<DeleteRequestDto> requestDto);
        #endregion

        #region Course Student CRUD
        Task<Result<PaginatedResult<GetEnrolledStudentResponseDto>>> GetEnrolledStudentsAsync(GetEnrolledStudentRequestDto requestDto);
        Task<Result<GetAvailableStudentResponseDto>> GetAvailableStudentsAsync(GetAvailableStudentRequestDto requestDto);
        Task<Result<bool>> AddStudentsToCourseAndTutorialAsync(AddStudentsToCourseRequestDto requestDto);
        Task<Result<bool>> AddSingleStudentToCourseAsync(AddStudentToCourseWithoutUserIdRequestDto requestDto);
        Task<Result<bool>> AddStudentsByCsvToCourseAsync(int courseId, IFormFile file);
        Task<Result<bool>> RemoveStudentFromCourseAsync(RemoveStudentFromCourseRequestDto requestDto);
        #endregion

        
    }
}