namespace attendance1.Application.DTOs.Models
{
    public class CourseFilters
    {
        public int? ProgrammeId { get; set; }
        public int? LecturerUserId { get; set; }
        public string? Status { get; set; }
        public string? Session { get; set; }
    }
}