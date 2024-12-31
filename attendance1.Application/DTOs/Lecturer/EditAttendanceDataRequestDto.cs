namespace attendance1.Application.DTOs.Lecturer
{
    public class EditAttendanceDataRequestDto
    {
        public int CourseId { get; set; }
        public int AttendanceCodeId { get; set; }
        //public DateTime DateAndTime { get; set; } = DateTime.UtcNow;
        public List<EditAttendanceDataDto> AttendanceData { get; set; } = [];
    }

    public class EditAttendanceDataDto
    {
        // insert
        //public string StudentId { get; set; } = string.Empty;
        public string Remark { get; set; } = string.Empty;
        public bool IsPresent { get; set; }

        // remove
        public int? AttendanceId { get; set; }
    }
}