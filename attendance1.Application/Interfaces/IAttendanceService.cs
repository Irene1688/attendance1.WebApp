namespace attendance1.Application.Interfaces
{
    public interface IAttendanceService
    {
        Task<Result<PaginatedResult<GetAttendanceRecordByCourseIdResponseDto>>> GetAttendanceRecordByCourseIdAsync(GetAttendanceRecordByCourseIdRequestDto requestDto);
    }
}