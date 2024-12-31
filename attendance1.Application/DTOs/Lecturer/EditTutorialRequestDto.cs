namespace attendance1.Application.DTOs.Lecturer
{
    public class EditTutorialRequestDto
    {
        public int TutorialId { get; set; }
        public int CourseId { get; set; }
        public string TutorialName { get; set; } = string.Empty;
        public string TutorialClassDay { get; set; } = string.Empty;
    }
}
