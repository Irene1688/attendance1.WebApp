using attendance1.Application.DTOs.Common;

namespace attendance1.Application.DTOs.Lecturer;

public class GetEnrolledStudentRequestDto
{
    public int CourseId { get; set; }
    public string SearchTerm { get; set; } = string.Empty;
    public PaginatedRequestDto PaginatedRequest { get; set; } = new PaginatedRequestDto();
}

