namespace attendance1.Application.DTOs.Models
{
    public class StudentAttendanceDto
    {
        public string StudentId { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public int? TutorialId { get; set; }
        public string TutorialName { get; set; } = string.Empty;
    }
}