using System;
using System.Collections.Generic;

namespace attendance1.Domain.Entities;

public partial class AttendanceRecord
{
    public int RecordId { get; set; }

    public string AttendanceCode { get; set; } = null!;

    public DateOnly Date { get; set; }

    public TimeOnly? StartTime { get; set; }

    public TimeOnly? EndTime { get; set; }

    public int CourseId { get; set; }

    public int? TutorialId { get; set; }

    public bool IsLecture { get; set; }

    public virtual Course Course { get; set; } = null!;

    public virtual Tutorial Tutorial { get; set; } = null!;

    public virtual ICollection<StudentAttendance> StudentAttendances { get; set; } = new List<StudentAttendance>();
}
