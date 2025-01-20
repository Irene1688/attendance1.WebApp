using attendance1.Application.DTOs.Models;

namespace attendance1.Application.DTOs.ProgrammeDTOs
{
    public class GetProgrammeRequestDto
    {
        public string SearchTerm { get; set; } = string.Empty;
        public PaginatedRequestDto PaginatedRequest { get; set; } = new();
    }
}