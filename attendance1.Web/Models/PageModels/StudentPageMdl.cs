namespace attendance1.Web.Models.PageModels
{
    public class StudentPageMdl
    {
        public List<StudentMdl> StudentList { get; set; }
        public Dictionary<string, List<ClassMdl>> EnrolledClasses { get; set; }

        public Dictionary<string, StudentDeviceMdl> BindingDevices {  get; set; }
    }
}
