namespace attendance1.Web.Models
{
    public class AttendanceMdl
    {
        public int AttendanceId { get; set; }
        public string? AttendanceCode { get; set; }
        public string? Duration { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int CourseID { get; set; }
    }
}
