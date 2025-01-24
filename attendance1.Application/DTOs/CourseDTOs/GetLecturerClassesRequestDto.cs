namespace attendance1.Application.DTOs.CourseDTOs
{
    public class GetLecturerClassRequestDto
    {
        public string LecturerId { get; set; } = string.Empty;
        public List<CourseDto> Courses { get; set; } = [];
    }
}
