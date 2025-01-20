using attendance1.Application.DTOs.Models;

namespace attendance1.Application.DTOs.StudentDTOs;

public class GetEnrolledStudentRequestDto
{
    public int CourseId { get; set; }
    public string SearchTerm { get; set; } = string.Empty;
    public PaginatedRequestDto PaginatedRequest { get; set; } = new();
}

