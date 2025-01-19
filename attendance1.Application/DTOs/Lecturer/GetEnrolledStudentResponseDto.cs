namespace attendance1.Application.DTOs.Lecturer
{
    public class GetEnrolledStudentResponseDto
    {
        public string StudentId { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public string StudentEmail { get; set; } = string.Empty;
        public string TutorialName { get; set; } = string.Empty;
        public double AttendanceRate { get; set; }
    }   
}


