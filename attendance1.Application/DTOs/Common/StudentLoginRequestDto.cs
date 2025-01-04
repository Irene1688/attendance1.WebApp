using attendance1.Application.Common.Enum;

namespace attendance1.Application.DTOs.Common
{
    public class StudentLoginRequestDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public AccRoleEnum Role { get; set; } = AccRoleEnum.Student;
    }
}