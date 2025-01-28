namespace attendance1.Application.DTOs.Models
{
    public class TutorialDto
    {
        public int TutorialId { get; set; }
        public string TutorialName { get; set; } = string.Empty;
        public string ClassDay { get; set; } = string.Empty;
        public int StudentCount { get; set; }
    }
}