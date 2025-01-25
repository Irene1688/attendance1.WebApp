namespace attendance1.Application.DTOs.StudentDTOs
{
    public class AddStudentToClassRequestDto
    {
        public int CourseId { get; set; }
        public string StudentId { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public int TutorialId { get; set; }

        public byte[] StudentList { get; set; } = [];
    }
}