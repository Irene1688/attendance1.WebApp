using System;
using System.Collections.Generic;

namespace attendance1.Domain.Entities;

public partial class Feedback
{
    public int FeedbackId { get; set; }

    public string StudentId { get; set; } = null!;

    public int Rating { get; set; }

    public string? FeedbackContent { get; set; }

    public DateTime Date { get; set; }
}
