namespace attendance1.Application.DTOs.Lecturer
{
    public class CreateSemesterRequestDto
    {
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }
}