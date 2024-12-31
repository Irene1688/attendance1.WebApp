using System;
using System.Collections.Generic;

namespace attendance1.Domain.Entities;

public partial class CourseSemester
{
    public int SemesterId { get; set; }

    public DateOnly StartWeek { get; set; }

    public DateOnly EndWeek { get; set; }

    public bool? IsDeleted { get; set; }

    public virtual ICollection<Course> Courses { get; set; } = new List<Course>();
}
