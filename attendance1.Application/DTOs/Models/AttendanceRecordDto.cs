namespace attendance1.Application.DTOs.Models
{
    public class AttendanceRecordDto
    {
        public int RecordId { get; set; }
        public DateOnly Date { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public bool IsLecture { get; set; }
        public int? TutorialId { get; set; }
        public string TutorialName { get; set; } = string.Empty;
        public List<StudentAttendanceStatusDto> Attendances { get; set; } = [];
    }
}