namespace attendance1.Application.DTOs.Models;

public class UserDto
{
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string CampusId { get; set; } = string.Empty;
}