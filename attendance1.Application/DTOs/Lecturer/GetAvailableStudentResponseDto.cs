using attendance1.Application.DTOs.Common;

namespace attendance1.Application.DTOs.Lecturer
{
    public class GetAvailableStudentResponseDto
    {
        public List<DataIdResponseDto> Students { get; set; } = [];
    }

}