using System;
using System.Collections.Generic;

namespace attendance1.Domain.Entities;

public partial class EnrolledStudent
{
    public int EnrolledId { get; set; }

    public string StudentId { get; set; } = null!;

    public int CourseId { get; set; }
    public int TutorialId { get; set; }
    public string StudentName { get; set; } = null!;

    public bool? IsDeleted { get; set; }

    public virtual Course Course { get; set; } = null!;
    public virtual Tutorial Tutorial { get; set; } = null!;
}
