namespace attendance1.Application.DTOs.AttendanceDTOs
{
    public class SubmitAttendanceRequestDto
    {
        public string StudentId { get; set; } = string.Empty;
        public string AttendanceCode { get; set; } = string.Empty;
    }
}