namespace attendance1.Application.DTOs.AttendanceDTOs
{
    public class GetAttendanceCodeResponseDto
    {
        public int CodeId { get; set; }
        public string AttendanceCode { get; set; } = string.Empty;
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
    }
}
