using attendance1.Application.Common.Response;
using attendance1.Application.DTOs.Student;
using attendance1.Application.DTOs.Common;

namespace attendance1.Application.Interfaces
{
    public interface IStudentService
    {
        Task<Result<List<GetAttendanceRecordResponseDto>>> GetAttendanceInCurrentWeekAsync(DataIdRequestDto requestDto);
        Task<Result<bool>> SubmitAttendanceAsync(CreateAttendanceRecordRequestDto requestDto);
        Task<Result<List<DataIdResponseDto>>> GetEnrollmentClassesAsync(DataIdRequestDto requestDto);
        Task<Result<GetClassDetailsWithAttendanceResponseDto>> GetClassDetailsWithAttendanceByStudentIdAsync(DataIdRequestDto requestDto);
        Task<Result<List<GetAttendanceRecordResponseDto>>> GetAllAttendanceByStudentIdAsync(DataIdRequestDto requestDto);
    }
}   