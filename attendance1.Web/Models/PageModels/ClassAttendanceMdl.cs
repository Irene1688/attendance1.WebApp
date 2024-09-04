namespace attendance1.Web.Models.PageModels
{
    public class ClassAttendanceMdl
    {
        public ClassMdl ClassDetails { get; set; }
        public List<StudentMdl> EnrolledStudents { get; set; }
        public List<int> ClassDays { get; set; }
        public List<StudentAttendanceMdl> StudentAttendance { get; set; }
        public (int, DateTime?) LatestAttendanceDate { get; set; }

        //public Dictionary<int, List<string>> StudentAttendance { get; set; }
        public List<ClassWeekMdl> WeekDetails { get; set; }

    }
}
