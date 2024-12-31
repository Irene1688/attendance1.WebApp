public class InvalidatedToken
{
    public string Jti { get; set; } = string.Empty;
    public DateTime InvalidatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
} 