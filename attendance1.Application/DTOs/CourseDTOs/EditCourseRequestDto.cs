namespace attendance1.Application.DTOs.CourseDTOs
{
    public class EditCourseRequestDto
    {
        public AccRoleEnum UpdatedBy { get; set; }
        public int CourseId { get; set; }
        public string CourseCode { get; set; } = string.Empty;
        public string CourseName { get; set; } = string.Empty;
        public string CourseSession { get; set; } = string.Empty;
        public DateOnly CourseStartFrom { get; set; }
        public DateOnly CourseEndTo { get; set; }
        public int ProgrammeId { get; set; }
        public int LecturerUserId { get; set; }
        public List<int> ClassDays { get; set; } = [];
        public List<EditTutorialDto> Tutorials { get; set; } = [];
    }

    public class EditTutorialDto
    {
        public int TutorialId { get; set; }
        public int ClassDay { get; set; }
        public string TutorialName { get; set; } = string.Empty;
    }
}