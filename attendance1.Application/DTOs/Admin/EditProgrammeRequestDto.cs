namespace attendance1.Application.DTOs.Admin
{
    public class EditProgrammeRequestDto
    {
        public int ProgrammeId { get; set; }
        public string ProgrammeName { get; set; } = string.Empty;
    }
}