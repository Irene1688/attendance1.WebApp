namespace attendance1.Application.DTOs.ProgrammeDTOs
{
    public class EditProgrammeRequestDto
    {
        public int ProgrammeId { get; set; }
        public string ProgrammeName { get; set; } = string.Empty;
    }
}