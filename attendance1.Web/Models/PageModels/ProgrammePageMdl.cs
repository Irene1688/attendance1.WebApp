namespace attendance1.Web.Models.PageModels
{
    public class ProgrammePageMdl
    {
        public List<ProgrammeMdl> ProgrammeList { get; set; }
        public Dictionary<string, List<StaffMdl>> AdminGroupedByProgrammeName { get; set; }
        public Dictionary<int, List<ClassMdl>> ClassGroupedByProgrammeId { get; set; }
    }
}
