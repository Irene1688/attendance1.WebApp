namespace attendance1.Web.Models
{
    public class StudentDeviceMdl
    {
        public int DeviceId { get; set; }
        //public string DeviceType { get; set; }

        public string DeviceOS { get; set; }
        public string MacAddress { get; set;}


        public string UUID { get; set;}
        public string StudentId { get; set;}
        public int HardwareConcurrency { get; set; }
        public int ColorDepth { get; set; }
        public string ScreenResolution { get; set; }
        public string DeviceType { get; set; }
        public string EncodeDeviceCodeWithoutUUID {  get; set; }
        public DateTime BindDate {  get; set; }  
    }
}
