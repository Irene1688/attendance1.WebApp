namespace attendance1.Application.DTOs.CourseDTOs
{
    public class GetStudentEnrolledCourseSelectionResponseDto
    {
        public int CourseId { get; set; }
        public string CourseCode { get; set; } = string.Empty;
        public string CourseName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}