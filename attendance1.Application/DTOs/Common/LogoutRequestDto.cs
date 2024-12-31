namespace attendance1.Application.DTOs.Common
{
    public class LogoutRequestDto
    {
        public string RefreshToken { get; set; } = string.Empty;
        public string AccessToken { get; set; } = string.Empty;
    }
}