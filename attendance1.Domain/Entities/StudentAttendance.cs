using System;
using System.Collections.Generic;

namespace attendance1.Domain.Entities;

public partial class StudentAttendance
{
    public int AttendanceId { get; set; }

    public string StudentId { get; set; } = null!;

    public DateTime DateAndTime { get; set; }

    public int? CourseId { get; set; }

    public bool IsPresent { get; set; }

    public string? Remark { get; set; }

    public int RecordId { get; set; }

    public virtual Course? Course { get; set; }

    public virtual AttendanceRecord Record { get; set; } = null!;
}
