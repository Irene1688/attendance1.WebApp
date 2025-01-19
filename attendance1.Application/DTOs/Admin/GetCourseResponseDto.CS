namespace attendance1.Application.DTOs.Admin
{
    public class GetCourseResponseDto
    {
        public int CourseId { get; set; }
        public string CourseCode { get; set; } = string.Empty;
        public string CourseName { get; set; } = string.Empty;
        public string CourseSession { get; set; } = string.Empty;
        public int ProgrammeId { get; set; }
        public string ProgrammeName { get; set; } = string.Empty;
        public int LecturerUserId { get; set; }
        public string LecturerName { get; set; } = string.Empty;
        public string ClassDay { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        //public List<GetStudentResponseDto> EnrolledStudents { get; set; } = [];
        public List<GetTutorialResponseDto> Tutorials { get; set; } = [];
    }

    public class GetTutorialResponseDto
    {
        public int TutorialId { get; set; }
        public string ClassDay { get; set; } = string.Empty;
        public string TutorialName { get; set; } = string.Empty;
        public int StudentCount { get; set; }
        //public List<GetStudentResponseDto> EnrolledStudents { get; set; } = [];
        
    }
}