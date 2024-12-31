namespace attendance1.Application.DTOs.Common
{
    public class SemesterDto
    {
        public int SemesterId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }
}