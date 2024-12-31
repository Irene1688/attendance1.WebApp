namespace attendance1.Application.DTOs.Student
{
    public class GetAttendanceRecordResponseDto
    {
        public bool IsPresent { get; set; }
        public DateOnly Date { get; set; }
        public DateTime AttendanceTime { get; set; }
        public string ClassCode { get; set; } = string.Empty;
        public string ClassName { get; set; } = string.Empty;
        public string LectureName { get; set; } = string.Empty;
        public string SessionName { get; set; } = string.Empty;
    }
}