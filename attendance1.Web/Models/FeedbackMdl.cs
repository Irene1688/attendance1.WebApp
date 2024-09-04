namespace attendance1.Web.Models
{
    public class FeedbackMdl
    {
        public int FeedbackId { get; set; }
        public string StudentName { get; set; }
        public string StudentId { get; set;}
        public DateTime Date { get; set;}
        public int Rate { get; set;}
        public string FeedbackContent { get; set;}
    }
}
