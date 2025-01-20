namespace attendance1.Application.DTOs.LecturerDTOs
{
    public class GetLecturerResponseDto
    {
        public int UserId { get; set; }
        public string LecturerId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string ProgrammeName { get; set; } = string.Empty;
        public List<LecturerCourseViewResponseDto> RegisteredCourses { get; set; } = [];
    }

    public class LecturerCourseViewResponseDto
    {
        public int CourseId { get; set; }
        public string CourseCode { get; set; } = string.Empty;
        public string CourseName { get; set; } = string.Empty;
        public string CourseSession { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int EnrolledStudentsCount { get; set; }
    }
}