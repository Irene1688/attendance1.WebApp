namespace attendance1.Application.DTOs.Common
{
    public class PaginatedRequestDto
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 15;
    }
}