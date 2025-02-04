namespace attendance1.Application.DTOs.AttendanceDTOs
{
    public class CreateAttendanceRecordsRequestDto
    {
        public int CourseId { get; set; }
        public DateOnly AttendanceDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public bool IsLecture { get; set; }
        public int? TutorialId { get; set; }
    }
}
