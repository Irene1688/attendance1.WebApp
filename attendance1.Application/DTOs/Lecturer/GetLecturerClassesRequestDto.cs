namespace attendance1.Application.DTOs.Lecturer
{
    public class GetLecturerClassRequestDto
    {
        public string LecturerId { get; set; } = string.Empty;
        public int ClassId { get; set; }
        public string ClassName { get; set; } = string.Empty;
        public string ClassSession { get; set; } = string.Empty;
        public string ClassCode { get; set; } = string.Empty;
        public string OnClassDay { get; set; } = string.Empty;
    }
}
