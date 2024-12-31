namespace attendance1.Application.DTOs.Student
{
    public class CreateAttendanceRecordRequestDto
    {
        public string StudentId { get; set; } = string.Empty;
        public string AttendanceCode { get; set; } = string.Empty;
    }
}