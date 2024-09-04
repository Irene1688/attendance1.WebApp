using System.ComponentModel.DataAnnotations;

namespace attendance1.Web.Models
{
    public class ClassMdl
    {
        public string? LecturerName { get; set; }
        public string? LecturerId { get; set; }
        public int CourseId { get; set; }
        //public string? ClassName { get; set; }
        public string? ClassSession { get; set; }
        //public string? CourseCode { get; set; }
        public List<ProgrammeMdl>? ProgrammeDropDownMenu { get; set;}

        //可以删
        public string? Programme { get; set; }

        [Required]
        public int ProgrammeId { get; set; }

        [Required]
        public string SessionMonth { get; set; }

        [Required]
        public string SessionYear { get; set; }

        [Required]
        public string CourseCode { get; set; }

        [Required]
        public string ClassName { get; set; }

        public int SemesterId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public string ClassDays { get; set; }

        public bool IsActive {  get; set; } 

        public IFormFile? CsvFile { get; set; }

        //public ClassMdl() 
        //{
        //    ClassName = null;
        //    ClassSession = null;
        //    CourseCode = null;
        //}

    }
}
