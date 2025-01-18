namespace attendance1.Application.DTOs.Admin
{
    public class GetStudentResponseDto
    {
        public int UserId { get; set; }
        public string StudentId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string ProgrammeName { get; set; } = string.Empty;
        public List<StudentCourseViewResponseDto> EnrolledCourses { get; set; } = [];
    }

    public class StudentCourseViewResponseDto
    {
        public int CourseId { get; set; }
        public string CourseCode { get; set; } = string.Empty;
        public string CourseName { get; set; } = string.Empty;
        public string LecturerName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string TutorialSession { get; set; } = string.Empty;
    }
}