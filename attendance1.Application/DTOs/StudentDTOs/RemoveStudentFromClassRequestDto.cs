namespace attendance1.Application.DTOs.StudentDTOs
{
    public class RemoveStudentFromCourseRequestDto
    {
        public int CourseId { get; set; }
        public List<string> StudentIdList { get; set; } = [];
    }
}