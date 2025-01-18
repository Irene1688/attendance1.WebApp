using attendance1.Application.DTOs.Common;

namespace attendance1.Application.DTOs.Admin
{
    public class GetProgrammeSelectionResponseDto
    {
        public List<DataIdResponseDto> Programmes { get; set; } = [];
    }
}