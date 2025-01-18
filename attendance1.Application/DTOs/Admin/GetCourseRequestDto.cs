using attendance1.Application.DTOs.Common;

namespace attendance1.Application.DTOs.Admin
{
    public class GetCourseRequestDto
    {
        public PaginatedRequestDto PaginatedRequest { get; set; } = new();
        public string SearchTerm { get; set; } = string.Empty;
        public CourseFilters? Filters { get; set; }
    }

    public class CourseFilters
    {
        public int? ProgrammeId { get; set; }
        public string? LecturerId { get; set; }
        public string? Status { get; set; }
        public string? Session { get; set; }
    }
}