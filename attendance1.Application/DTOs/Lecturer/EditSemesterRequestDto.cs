namespace attendance1.Application.DTOs.Lecturer
{
    public class EditSemesterRequestDto
    {
        public int SemesterId { get; set; }
        public DateOnly StartWeek { get; set; }
        public DateOnly EndWeek { get; set; }
    }
}