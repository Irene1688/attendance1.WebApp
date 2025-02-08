namespace attendance1.Application.DTOs.Models
{
    public class DeviceInfoDto
    {
        public string Fingerprint { get; set; } = string.Empty;
        public string UserAgent { get; set; } = string.Empty;
        public string Platform { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public string ScreenResolution { get; set; } = string.Empty;
        public string Timezone { get; set; } = string.Empty;
    }

}