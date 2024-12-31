namespace attendance1.Application.DTOs.Lecturer
{
    public class CreateClassRequestDto
    {
        public string LecturerId { get; set; } = string.Empty;
        public string ClassCode { get; set; } = string.Empty;
        public string ClassName { get; set; } = string.Empty;
        public string ClassSession { get; set; } = string.Empty;
        public string LectureClassDay { get; set; } = string.Empty;
        public int ProgrammeId { get; set; }
        public CreateSemesterRequestDto Semester { get; set; } = new CreateSemesterRequestDto();
        public List<CreateTutorialRequestDto> Tutorials { get; set; } = [];
        public byte[] StudentList { get; set; } = [];
    }
}