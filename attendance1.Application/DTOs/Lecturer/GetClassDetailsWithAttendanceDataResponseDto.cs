using attendance1.Application.DTOs.CommonDTOs;

namespace attendance1.Application.DTOs.Lecturer
{
    public class GetClassDetailsWithAttendanceDataResponseDto
    {
        public int CourseId { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public string CourseCode { get; set; } = string.Empty;
        public string CourseSession { get; set; } = string.Empty;
        public string ClassDay { get; set; } = string.Empty;
        public string ProgrammeName { get; set; } = string.Empty;
        public List<GetTutorialDetailsResponseDto> Tutorials { get; set; } = [];
        public List<GetStudentWithAttendanceDataResponseDto> EnrolledStudentsWithAttendance { get; set; } = new List<GetStudentWithAttendanceDataResponseDto>();
        public List<ClassWeekModel> LectureWeekOfClass { get; set; } = [];
    }

    public class ClassWeekModel
    {
        public int WeekIndex { get; set; }
        public List<DateOnly> ClassDaysInThisWeek { get; set; } = [];
    }

}