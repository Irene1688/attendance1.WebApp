namespace attendance1.Application.DTOs.Models
{
    public class DeviceInfoDto
    {
        //public string Fingerprint { get; set; } = string.Empty;
        //public string UserAgent { get; set; } = string.Empty;
        public string Platform { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public string ScreenResolution { get; set; } = string.Empty;
        public string Timezone { get; set; } = string.Empty;
        public int HardwareConcurrency { get; set; } = 4; // 设定默认值
        public int DeviceMemory { get; set; } = 2; // 设定默认值
        public int MaxTouchPoints { get; set; } = 0;
        public string CanvasHash { get; set; } = string.Empty; // 使用哈希值存储 Canvas 指纹
    }

}