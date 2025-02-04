namespace attendance1.Application.DTOs.AttendanceDTOs
{
    public class UpdateStudentAttendanceStatusRequestDto
    {
        public int CourseId { get; set; }
        public int AttendanceCodeId { get; set; }
        public string StudentId { get; set; } = string.Empty;
        public bool IsPresent { get; set; }
    }
}