using attendance1.Application.DTOs.Common;

namespace attendance1.Application.DTOs.Lecturer
{
    public class GetClassDetailsResponseDto
    {
        public int CourseId { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public string CourseCode { get; set; } = string.Empty;
        public string CourseSession { get; set; } = string.Empty;
        public string ClassDay { get; set; } = string.Empty;
        public ProgrammeDto Programme { get; set; } = new ProgrammeDto();
        public SemesterDto Semester { get; set; } = new SemesterDto();
    }
}