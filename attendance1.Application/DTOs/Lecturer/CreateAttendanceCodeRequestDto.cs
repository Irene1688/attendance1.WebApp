namespace attendance1.Application.DTOs.Lecturer
{
    public class CreateAttendanceCodeRequestDto
    {
        public int CourseId { get; set; }
        public bool IsLecture { get; set; }
        public int DurationInSeconds { get; set; }
        public int? TutorialId { get; set; }
    }
}