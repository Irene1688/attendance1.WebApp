namespace attendance1.Application.DTOs.Lecturer
{
    public class CreateTutorialRequestDto
    {
        public int CourseId { get; set; }
        public string LecturerId { get; set; } = string.Empty;
        public string TutorialName { get; set; } = string.Empty;
        public string TutorialClassDay { get; set; } = string.Empty;
    }
}
