namespace attendance1.Application.DTOs.StudentDTOs
{
    public class AddStudentsToCourseRequestDto
    {
        public int CourseId { get; set; }
        public int TutorialId { get; set; }
        public List<int> StudentUserIds { get; set; } = [];
        public List<string> StudentIds { get; set; } = [];
    }
}