using attendance1.Application.DTOs.Models;

namespace attendance1.Application.DTOs.CourseDTOs
{
    public class GetCourseRequestDto
    {
        public PaginatedRequestDto PaginatedRequest { get; set; } = new();
        public string SearchTerm { get; set; } = string.Empty;
        public CourseFilters? Filters { get; set; }
    }
}