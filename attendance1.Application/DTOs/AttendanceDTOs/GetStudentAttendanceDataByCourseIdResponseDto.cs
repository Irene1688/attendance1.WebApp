namespace attendance1.Application.DTOs.AttendanceDTOs
{
    public class GetStudentAttendanceDataByCourseIdResponseDto
    {
        public List<AttendanceRecordDto> Records { get; set; } = [];
        public List<StudentAttendanceDto> Students { get; set; } = [];
        public List<TutorialDto> Tutorials { get; set; } = [];
        public int Total { get; set; }
    }
}





