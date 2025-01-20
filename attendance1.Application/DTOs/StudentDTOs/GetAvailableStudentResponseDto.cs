using attendance1.Application.DTOs.CommonDTOs;

namespace attendance1.Application.DTOs.StudentDTOs
{
    public class GetAvailableStudentResponseDto
    {
        public List<DataIdResponseDto> Students { get; set; } = [];
    }

}