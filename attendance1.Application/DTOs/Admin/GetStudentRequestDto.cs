using attendance1.Application.DTOs.Common;

namespace attendance1.Application.DTOs.Admin
{
    public class GetStudentRequestDto
    {
        public string SearchTerm { get; set; } = string.Empty;
        public PaginatedRequestDto PaginatedRequest { get; set; } = new();
    }
}