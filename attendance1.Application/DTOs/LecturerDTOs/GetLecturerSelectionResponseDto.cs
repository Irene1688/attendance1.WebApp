using attendance1.Application.DTOs.CommonDTOs;

namespace attendance1.Application.DTOs.LecturerDTOs
{
    public class GetLecturerSelectionResponseDto
    {
        public List<DataIdResponseDto> Lecturers { get; set; } = [];
    }
}