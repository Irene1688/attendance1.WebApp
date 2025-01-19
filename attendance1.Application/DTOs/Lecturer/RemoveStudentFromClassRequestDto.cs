namespace attendance1.Application.DTOs.Lecturer
{
    public class RemoveStudentFromClassRequestDto
    {
        public int CourseId { get; set; }
        public List<string> StudentIdList { get; set; } = [];
    }
}