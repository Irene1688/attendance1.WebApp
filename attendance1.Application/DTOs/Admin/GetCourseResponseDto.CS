namespace attendance1.Application.DTOs.Admin
{
    public class GetCourseResponseDto
    {
        public int CourseId { get; set; }
        public string CourseCode { get; set; } = string.Empty;
        public string CourseName { get; set; } = string.Empty;
        public string CourseSession { get; set; } = string.Empty;
        public string ProgrammeName { get; set; } = string.Empty;
        public string LecturerId { get; set; } = string.Empty;
        public string LecturerName { get; set; } = string.Empty;
        public string ClassDay { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        //public List<GetStudentResponseDto> EnrolledStudents { get; set; } = [];
        public List<GetTutorialResponseDto> Tutorials { get; set; } = [];
    }

    public class GetTutorialResponseDto
    {
        public int TutorialId { get; set; }
        public string ClassDay { get; set; } = string.Empty;
        public string TutorialName { get; set; } = string.Empty;
        //public List<GetStudentResponseDto> EnrolledStudents { get; set; } = [];
        
    }
}