namespace attendance1.Application.Interfaces
{
    public interface IAttendanceService
    {
        Task<Result<PaginatedResult<GetAttendanceRecordByCourseIdResponseDto>>> GetAttendanceRecordByCourseIdAsync(GetAttendanceRecordByCourseIdRequestDto requestDto);
        Task<Result<GetAttendanceCodeResponseDto>> GenerateAttendanceCodeAsync(CreateAttendanceCodeRequestDto requestDto);
        Task<Result<GetStudentAttendanceDataByCourseIdResponseDto>> GetCourseStudentAttendanceRecordsAsync(DataIdRequestDto requestDto);
        Task<Result<bool>> InsertAbsentStudentAttendanceAsync(CreateAbsentStudentAttendanceRequestDto requestDto);
        
        /// <summary>
        /// Generate attendance records for a given course and date
        /// Default attendance code is "Present" for all students in the course
        /// </summary>
        Task<Result<bool>> GenerateAttendanceRecordsAsync(CreateAttendanceRecordsRequestDto requestDto);

        /// <summary>
        /// Update the attendance status of a student for a given attendance code id
        /// </summary>
        Task<Result<bool>> UpdateStudentAttendanceStatusAsync(UpdateStudentAttendanceStatusRequestDto requestDto);  
    }
}