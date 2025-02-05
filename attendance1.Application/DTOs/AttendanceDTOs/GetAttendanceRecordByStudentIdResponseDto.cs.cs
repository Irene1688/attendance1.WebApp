namespace attendance1.Application.DTOs.AttendanceDTOs
{
    public class GetAttendanceRecordByStudentIdResponseDto
    {
        public bool IsPresent { get; set; }
        public DateOnly Date { get; set; }
        public DateTime AttendanceTime { get; set; }
        public string CourseCode { get; set; } = string.Empty;
        public string CourseName { get; set; } = string.Empty;
        public string LectureName { get; set; } = string.Empty;
        public string SessionName { get; set; } = string.Empty;
    }
}