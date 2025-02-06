namespace attendance1.Application.Interfaces
{
    public interface IStudentService
    {
        //Task<Result<List<GetAttendanceRecordResponseDto>>> GetAttendanceInCurrentWeekAsync(DataIdRequestDto requestDto);
        //Task<Result<bool>> SubmitAttendanceAsync(CreateAttendanceRecordRequestDto requestDto);
        //Task<Result<List<DataIdResponseDto>>> GetEnrollmentClassesAsync(DataIdRequestDto requestDto);
        //Task<Result<GetClassDetailsWithAttendanceResponseDto>> GetClassDetailsWithAttendanceByStudentIdAsync(DataIdRequestDto requestDto);
        Task<Result<List<GetAttendanceRecordByStudentIdResponseDto>>> GetAllAttendanceByStudentIdAsync(DataIdRequestDto requestDto);
    }
}   