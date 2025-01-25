namespace attendance1.Application.Interfaces
{
    public interface IAttendanceService
    {
        Task<Result<PaginatedResult<GetAttendanceRecordByCourseIdResponseDto>>> GetAttendanceRecordByCourseIdAsync(GetAttendanceRecordByCourseIdRequestDto requestDto);
        Task<Result<GetAttendanceCodeResponseDto>> GenerateAttendanceCodeAsync(CreateAttendanceCodeRequestDto requestDto);
        Task<Result<GetStudentAttendanceDataByCourseIdResponseDto>> GetCourseStudentAttendanceRecordsAsync(DataIdRequestDto requestDto);
        Task<Result<bool>> InsertAbsentStudentAttendanceAsync(CreateAbsentStudentAttendanceRequestDto requestDto);
    }
}