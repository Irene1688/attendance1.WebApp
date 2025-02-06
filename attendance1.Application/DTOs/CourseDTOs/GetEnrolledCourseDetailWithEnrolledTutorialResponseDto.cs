namespace attendance1.Application.DTOs.CourseDTOs
{
    public class GetEnrolledCourseDetailWithEnrolledTutorialResponseDto
    {
        public int CourseId { get; set; }
        public string CourseCode { get; set; } = string.Empty;
        public string CourseName { get; set; } = string.Empty;
        public string CourseSession { get; set; } = string.Empty;
        public string ProgrammeName { get; set; } = string.Empty;
        public string LecturerName { get; set; } = string.Empty;
        public TutorialDto EnrolledTutorial { get; set; } = new TutorialDto();
    }
}