namespace attendance1.Application.DTOs.AttendanceDTOs
{
    public class GetExistedAttendanceCodeByCourseIdResponseDto
    {
        public int RecordId { get; set; }
        public DateOnly LastUsedDate { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public bool IsLecture { get; set; }
        public string TutorialName { get; set; } = string.Empty;
        public string AttendanceCode { get; set; } = string.Empty;
    }
}