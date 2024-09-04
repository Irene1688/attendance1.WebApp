namespace attendance1.Web.Models.PageModels
{
    public class LecturerPageMdl
    {
        public List<StaffMdl> AllLecturer { get; set; }

        public Dictionary<string, List<ClassMdl>> GroupedClassBasedOnLecturer { get; set; }
    }
}
