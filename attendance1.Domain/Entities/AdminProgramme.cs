using System;
using System.Collections.Generic;

namespace attendance1.Domain.Entities;

public partial class AdminProgramme
{
    public int ApId { get; set; }

    public int? UserId { get; set; }

    public int? ProgrammeId { get; set; }

    public virtual Programme? Programme { get; set; }

    public virtual UserDetail? User { get; set; }
}
