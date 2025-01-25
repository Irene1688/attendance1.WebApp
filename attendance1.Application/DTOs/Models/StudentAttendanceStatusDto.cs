namespace attendance1.Application.DTOs.Models
{
    public class StudentAttendanceStatusDto
    {
        public string StudentId { get; set; } = string.Empty;
        public bool IsPresent { get; set; }
    }
}