using attendance1.Application.DTOs.Common;

namespace attendance1.Application.DTOs.Admin
{
    public class GetLecturerSelectionResponseDto
    {
        public List<DataIdResponseDto> Lecturers { get; set; } = [];
    }
}