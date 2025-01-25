namespace attendance1.Application.DTOs.CourseDTOs
{
    public class GetCourseDetailsResponseDto
    {
        public int CourseId { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public string CourseCode { get; set; } = string.Empty;
        public string CourseSession { get; set; } = string.Empty;
        public string ClassDay { get; set; } = string.Empty;
        public List<TutorialDto> Tutorials { get; set; } = [];
        public ProgrammeDto Programme { get; set; } = new ProgrammeDto();
        public SemesterDto Semester { get; set; } = new SemesterDto();
    }
}