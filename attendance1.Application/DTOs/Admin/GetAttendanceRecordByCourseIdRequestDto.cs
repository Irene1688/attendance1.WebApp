using attendance1.Application.DTOs.Common;

namespace attendance1.Application.DTOs.Admin
{
    public class GetAttendanceRecordByCourseIdRequestDto
    {
        public int CourseId { get; set; }
        public PaginatedRequestDto PaginatedRequest { get; set; } = new();
    }
}