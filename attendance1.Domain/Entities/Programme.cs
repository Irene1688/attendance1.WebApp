using System;
using System.Collections.Generic;

namespace attendance1.Domain.Entities;

public partial class Programme
{
    public int ProgrammeId { get; set; }

    public string ProgrammeName { get; set; } = null!;
    public bool? IsDeleted { get; set; }

    public virtual ICollection<UserDetail> UserDetails { get; set; } = new List<UserDetail>();

    public virtual ICollection<AdminProgramme> AdminProgrammes { get; set; } = new List<AdminProgramme>();

    public virtual ICollection<Course> Courses { get; set; } = new List<Course>();
}
