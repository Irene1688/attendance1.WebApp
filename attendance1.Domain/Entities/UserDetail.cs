using System;
using System.Collections.Generic;

namespace attendance1.Domain.Entities;

public partial class UserDetail
{
    public int UserId { get; set; }

    public string? UserName { get; set; }

    public string? StudentId { get; set; }

    public string? LecturerId { get; set; }
    public int? ProgrammeId { get; set; }

    public string? Email { get; set; }

    public string? UserPassword { get; set; }

    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }

    public string? AccRole { get; set; }
    public bool? IsDeleted { get; set; }

    public virtual Programme? Programme { get; set; }
    public virtual ICollection<Course> Courses { get; set; } = new List<Course>();
    public virtual ICollection<Tutorial> Tutorials { get; set; } = new List<Tutorial>();


}
