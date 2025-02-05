namespace attendance1.Application.DTOs.CourseDTOs
{
    public class GetStudentActiveCourseResponseDto
    {
        public int CourseId { get; set; }
        public string CourseCode { get; set; } = string.Empty;
        public string CourseName { get; set; } = string.Empty;
        public string ClassDay { get; set; } = string.Empty;
        public string LecturerName { get; set; } = string.Empty;
        public List<TutorialDto> Tutorials { get; set; } = [];
    }
}