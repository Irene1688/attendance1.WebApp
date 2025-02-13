using System;
using System.Collections.Generic;

namespace attendance1.Domain.Entities;

public partial class Programme
{
    public int ProgrammeId { get; set; }

    public string ProgrammeName { get; set; } = null!;
    public bool? IsDeleted { get; set; }

    public virtual ICollection<UserDetail> UserDetails { get; set; } = new List<UserDetail>();

    public virtual ICollection<Course> Courses { get; set; } = new List<Course>();
}
