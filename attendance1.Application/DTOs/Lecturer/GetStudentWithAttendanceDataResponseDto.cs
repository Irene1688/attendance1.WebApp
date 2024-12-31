using attendance1.Application.DTOs.Common;

namespace attendance1.Application.DTOs.Lecturer
{
    public class GetStudentWithAttendanceDataResponseDto
    {
        public string StudentId { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public List<GetAttendanceDataResponseDto> AttendanceData { get; set; } = new List<GetAttendanceDataResponseDto>();
    }
}
