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
        public int UserId { get; set; }
        public List<int> ClassDays { get; set; } = [];
        public List<CreateTutorialDto> Tutorials { get; set; } = [];
    }

    public class CreateTutorialDto
    {
        public int ClassDay { get; set; }
        public string TutorialName { get; set; } = string.Empty;
    }
}