namespace attendance1.Web.Models
{
    public class StudentAttendanceMdl
    {
        public string StudentId { get; set; }
        public DateTime DateAndTime { get; set; }

        //public string AttendanceCode { get; set; }

        public int CourseId { get; set; }
        public int? DeviceId { get; set; }

        public int AttendanceId { get; set;}
        public string? Action { get; set;}
        

    }
}
