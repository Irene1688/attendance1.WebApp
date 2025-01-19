namespace attendance1.Application.DTOs.Lecturer
{
    public class AddStudentToClassRequestDto
    {
        public int CourseId { get; set; }
        public string StudentId { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;

        public byte[] StudentList { get; set; } = [];
    }
}