using System;
using System.Collections.Generic;

namespace attendance1.Domain.Entities;

public partial class Tutorial
{
    public int TutorialId { get; set; }

    public string? TutorialName { get; set; }

    public string? TutorialClassDay { get; set; }

    public int CourseId { get; set; }
    public string? LectureId { get; set; }
    
    public bool? IsDeleted { get; set; }
    public virtual Course Course { get; set; } = null!;
    public virtual ICollection<AttendanceRecord> AttendanceRecords { get; set; } = new List<AttendanceRecord>();
    public virtual ICollection<EnrolledStudent> EnrolledStudents { get; set; } = new List<EnrolledStudent>();
}
