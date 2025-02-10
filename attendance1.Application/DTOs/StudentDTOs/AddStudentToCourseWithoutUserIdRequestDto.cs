namespace attendance1.Application.DTOs.StudentDTOs
{
    public class AddStudentToCourseWithoutUserIdRequestDto
    {
        public int CourseId { get; set; }
        public string StudentId { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public int TutorialId { get; set; }
        public bool DefaultAttendance { get; set; } = false;
    }
}