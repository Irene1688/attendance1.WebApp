namespace attendance1.Application.DTOs.Lecturer
{
    public class RemoveStudentFromTutorialRequestDto
    {
        public int CourseId { get; set; }
        public int TutorialId { get; set; }
        public List<string> StudentIdList { get; set; } = [];
    }
}