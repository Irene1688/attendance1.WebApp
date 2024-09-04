namespace attendance1.Web.Models.PageModels
{
    public class StudentTakeAttendancePageMdl
    {
        public StudentMdl StudentDetail { get; set; }
        public List<StudentAttendanceMdl> StudentHistoryAttendance { get; set; }
        public List<ClassMdl> StudentHistoryCourse { get; set; }
        public List<int> CurrentWeekDate { get; set; }
        public List<string> CurrentWeekDay { get; set; }
        public List<string> CurrentWeekMonth { get; set; }
        public List<StaffMdl> AdminInfo { get; set; }
        public Dictionary<DateTime, List<StudentAttendanceMdl>> GroupedStudentHistoryAttendance { get; set; }

    }
}
