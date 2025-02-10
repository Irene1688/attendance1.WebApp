namespace attendance1.Application.Interfaces
{
    public interface ILectureService
    {
        #region class CRUD
        //Task<Result<List<GetLecturerClassRequestDto>>> GetClassesOfLecturerAsync(DataIdRequestDto requestDto);
        //Task<Result<bool>> EditClassAsync(EditClassRequestDto requestDto);
        //Task<Result<bool>> DeleteClassAsync(DeleteRequestDto requestDto);
        //Task<Result<DataIdResponseDto>> CreateNewClassAsync(CreateClassRequestDto requestDto);
        //Task<Result<GetClassDetailsResponseDto>> GetClassDetailsAsync(DataIdRequestDto requestDto);
        //Task<Result<GetClassDetailsWithAttendanceDataResponseDto>> GetClassDetailsWithAttendanceDataAsync(DataIdRequestDto requestDto);
        #endregion

        #region student CRUD
        //Task<Result<PaginatedResult<GetEnrolledStudentResponseDto>>> GetEnrolledStudentsAsync(GetEnrolledStudentRequestDto requestDto);
        //Task<Result<GetAvailableStudentResponseDto>> GetAvailableStudentsAsync(GetAvailableStudentRequestDto requestDto);
        //Task<Result<bool>> AddStudentToClassAsync(AddStudentToClassRequestDto requestDto);
        //Task<Result<bool>> AddStudentToTutorialAsync(AddStudentToTutorialRequestDto requestDto);
        //Task<Result<bool>> RemoveStudentFromClassAsync(RemoveStudentFromCourseRequestDto requestDto);
        Task<Result<bool>> RemoveStudentFromTutorialAsync(RemoveStudentFromTutorialRequestDto requestDto);
        #endregion

        #region tutorial CRUD
        // Task<Result<bool>> CreateNewTutorialAsync(CreateTutorialRequestDto requestDto);
        // Task<Result<bool>> EditTutorialAsync(EditTutorialRequestDto requestDto);
        // Task<Result<bool>> DeleteTutorialAsync(DeleteRequestDto requestDto);
        #endregion

        #region attendance CRUD
        //Task<Result<GetAttendanceCodeResponseDto>> GenerateAttendanceCodeAsync(CreateAttendanceCodeRequestDto requestDto);
        Task<Result<List<GetAttendanceWithStudentNameResponseDto>>> GetAttendanceByCodeIdAsync(DataIdRequestDto requestDto);
        //Task<Result<bool>> InsertAbsentStudentAttendanceAsync(CreateAbsentStudentAttendanceRequestDto requestDto);
        //Task<Result<bool>> ChangeAttendanceDataOfStudentAsync(EditAttendanceDataRequestDto requestDto);
        #endregion
    }
}
