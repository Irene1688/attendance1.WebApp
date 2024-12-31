namespace attendance1.Application.DTOs.Student
{
    public class GetClassDetailsWithAttendanceResponseDto
    {
        public string ClassCode { get; set; } = string.Empty;
        public string ClassName { get; set; } = string.Empty;
        public string LectureName { get; set; } = string.Empty;
        public List<AttendanceDto> AttendanceRecords { get; set; } = [];
    }

    public class AttendanceDto
    {
        public bool IsPresent { get; set; }
        public DateTime AttendanceTime { get; set; }
        public string SessionName { get; set; } = string.Empty;
    }
}   