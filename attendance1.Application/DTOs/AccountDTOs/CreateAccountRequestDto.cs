using attendance1.Application.Common.Enum;

namespace attendance1.Application.DTOs.AccountDTOs
{
    public class CreateAccountRequestDto
    {
        public string Name { get; set; } = string.Empty;
        public int ProgrammeId { get; set; }
        public string CampusId { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public AccRoleEnum Role { get; set; }
    }
}