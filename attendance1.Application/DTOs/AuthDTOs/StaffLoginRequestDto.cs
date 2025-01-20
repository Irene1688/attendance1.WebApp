using attendance1.Application.Common.Enum;

namespace attendance1.Application.DTOs.AuthDTOs
{
    public class StaffLoginRequestDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public AccRoleEnum Role { get; set; }
    }
}