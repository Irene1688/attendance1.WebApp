namespace attendance1.Application.DTOs.Lecturer
{
    public class GetAttendanceCodeResponseDto
    {
        public string AttendanceCode { get; set; } = string.Empty;
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public TimeSpan Duration 
        {
            get 
            {
                return EndTime - StartTime;
            }
        }
    }
}
