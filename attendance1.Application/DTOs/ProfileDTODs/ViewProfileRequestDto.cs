using attendance1.Application.Common.Enum;

namespace attendance1.Application.DTOs.ProfileDTODs
{
    public class ViewProfileRequestDto
    {
        public string CampusId { get; set; } = string.Empty;
        public AccRoleEnum Role { get; set; }
    }
}