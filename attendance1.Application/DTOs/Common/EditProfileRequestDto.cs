using attendance1.Application.Common.Enum;

namespace attendance1.Application.DTOs.Common
{
    public class EditProfileRequestDto
    {
        public int UserId { get; set; }
        public AccRoleEnum Role { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string CampusId { get; set; } = string.Empty;
    }
}