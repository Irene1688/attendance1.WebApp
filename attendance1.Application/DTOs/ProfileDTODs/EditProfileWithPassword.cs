using attendance1.Application.Common.Enum;

namespace attendance1.Application.DTOs.ProfileDTODs
{
    public class EditProfileWithPasswordRequestDto
    {
        public string CampusId { get; set; } = string.Empty;
        public AccRoleEnum Role { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}