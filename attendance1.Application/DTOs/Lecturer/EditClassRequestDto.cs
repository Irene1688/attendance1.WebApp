namespace attendance1.Application.DTOs.Lecturer
{
    public class EditClassRequestDto
    {
        public int ClassId { get; set; }
        public string ClassCode { get; set; } = string.Empty;
        public string ClassName { get; set; } = string.Empty;
        public string ClassSession { get; set; } = string.Empty;
        public string LectureClassDay { get; set; } = string.Empty;
        public int ProgrammeId { get; set; }
        public EditSemesterRequestDto Semester { get; set; } = new EditSemesterRequestDto();
    }
}