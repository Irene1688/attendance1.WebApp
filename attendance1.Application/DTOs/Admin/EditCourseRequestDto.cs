namespace attendance1.Application.DTOs.Admin
{
    public class EditCourseRequestDto
    {
        public int CourseId { get; set; }
        public string CourseCode { get; set; } = string.Empty;
        public string CourseName { get; set; } = string.Empty;
        public string CourseSession { get; set; } = string.Empty;
        public DateOnly CourseStartFrom { get; set; }
        public DateOnly CourseEndTo { get; set; }
        public int ProgrammeId { get; set; }
        public string LecturerId { get; set; } = string.Empty;
        public string ClassDay { get; set; } = string.Empty;
        public List<EditTutorialDto> Tutorials { get; set; } = [];
    }

    public class EditTutorialDto
    {
        public int TutorialId { get; set; }
        public string ClassDay { get; set; } = string.Empty;
        public string TutorialName { get; set; } = string.Empty;
    }
}