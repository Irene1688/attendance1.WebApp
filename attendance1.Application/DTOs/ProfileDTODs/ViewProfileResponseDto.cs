using attendance1.Application.Common.Enum;

namespace attendance1.Application.DTOs.ProfileDTODs
{
    public class ViewProfileResponseDto
    {
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string CampusId { get; set; } = string.Empty;
        public string ProgrammeName { get; set; } = string.Empty;
    }
}