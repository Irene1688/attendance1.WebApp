using attendance1.Application.DTOs.CommonDTOs;

namespace attendance1.Application.DTOs.ProgrammeDTOs
{
    public class GetProgrammeSelectionResponseDto
    {
        public List<DataIdResponseDto> Programmes { get; set; } = [];
    }
}