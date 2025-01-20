namespace attendance1.Application.DTOs.AttendanceDTOs
{
    public class GetAttendanceRecordByCourseIdResponseDto
    {
        public int RecordId { get; set; }
        public DateOnly Date { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public bool IsLecture { get; set; }
        public string TutorialName { get; set; } = string.Empty;
        public int PresentCount { get; set; }
        public int AbsentCount { get; set; }
        public double AttendanceRate { get; set; }
    }
}