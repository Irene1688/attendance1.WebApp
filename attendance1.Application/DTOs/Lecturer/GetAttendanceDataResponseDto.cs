namespace attendance1.Application.DTOs.Lecturer
{
    public class GetAttendanceDataResponseDto
    {
        public int AttendanceCodeId { get; set; }
        public int AttendanceId { get; set; }
        public DateTimeOffset DateAndTime { get; set; }
        public string Remark { get; set; } = string.Empty;
        public bool IsLecture { get; set; }
        public bool IsPresent { get; set; }
    }
}