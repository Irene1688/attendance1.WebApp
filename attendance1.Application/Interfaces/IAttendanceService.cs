namespace attendance1.Application.Interfaces
{
    public interface IAttendanceService
    {
        /// <summary>
        /// For admin to get all attendance records without student data by course id in class attendance management module
        /// </summary>
        Task<Result<PaginatedResult<GetAttendanceRecordByCourseIdResponseDto>>> GetAttendanceRecordByCourseIdAsync(GetAttendanceRecordByCourseIdRequestDto requestDto);
        
        /// <summary>
        /// For lecturer to generate attendance code
        /// </summary>
        Task<Result<GetAttendanceCodeResponseDto>> GenerateAttendanceCodeAsync(CreateAttendanceCodeRequestDto requestDto);
        
        /// <summary>
        /// For lecturer to get all students attendance data by course id in class attendance management module
        /// </summary>
        Task<Result<GetStudentAttendanceDataByCourseIdResponseDto>> GetCourseStudentAttendanceRecordsAsync(DataIdRequestDto requestDto);
        
        /// <summary>
        /// Insert absent student attendance for every time code is generated and expired
        /// </summary>
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

        /// <summary>
        /// Get the attendance of a student for a given course id
        /// </summary>
        Task<Result<List<GetAttendanceRecordByStudentIdResponseDto>>> GetAttendanceOfStudentAsync(DataIdRequestDto requestDto, bool isCurrentWeek = false);

        /// <summary>
        /// Submit attendance by a student
        /// </summary>
        Task<Result<bool>> SubmitAttendanceAsync(SubmitAttendanceRequestDto requestDto);
    }
}