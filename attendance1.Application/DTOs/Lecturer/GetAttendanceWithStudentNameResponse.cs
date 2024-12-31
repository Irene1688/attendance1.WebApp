namespace attendance1.Application.DTOs.Lecturer
{
    public class GetAttendanceWithStudentNameResponseDto
    {
        public string StudentId { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public bool IsPresent { get; set; }
        public DateTimeOffset DateAndTime { get; set; }
    }
}