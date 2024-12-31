namespace attendance1.Application.DTOs.Lecturer
{
    public class CreateAbsentStudentAttendanceRequestDto
    {
        public int CourseId { get; set; }
        public int AttendanceCodeId { get; set; }
    }
}