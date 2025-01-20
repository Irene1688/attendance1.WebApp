using attendance1.Application.DTOs.Models;

namespace attendance1.Application.DTOs.AttendanceDTOs
{
    public class GetAttendanceRecordByCourseIdRequestDto
    {
        public int CourseId { get; set; }
        public PaginatedRequestDto PaginatedRequest { get; set; } = new();
    }
}