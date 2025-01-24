namespace attendance1.Application.DTOs.Models
{
    public class CourseDto
    {
        public int CourseId { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public string CourseSession { get; set; } = string.Empty;
        public string CourseCode { get; set; } = string.Empty;
        public string OnClassDay { get; set; } = string.Empty;

        public List<DataIdResponseDto> Tutorials { get; set; } = [];
    }
}