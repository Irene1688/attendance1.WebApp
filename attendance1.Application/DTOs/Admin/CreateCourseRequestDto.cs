namespace attendance1.Application.DTOs.Admin
{
    public class CreateCourseRequestDto
    {
        public string CourseCode { get; set; } = string.Empty;
        public string CourseName { get; set; } = string.Empty;
        public string CourseSession { get; set; } = string.Empty;
        public DateOnly CourseStartFrom { get; set; }
        public DateOnly CourseEndTo { get; set; }
        public int ProgrammeId { get; set; }
        public string LecturerId { get; set; } = string.Empty;
        public string ClassDay { get; set; } = string.Empty;
        public List<CreateTutorialDto> Tutorials { get; set; } = [];
    }

    public class CreateTutorialDto
    {
        public string ClassDay { get; set; } = string.Empty;
        public string TutorialName { get; set; } = string.Empty;
    }
}