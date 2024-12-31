using System;
using System.Collections.Generic;

namespace attendance1.Domain.Entities; 

public partial class Course
{
    public int CourseId { get; set; }

    public int ProgrammeId { get; set; }

    public int SemesterId { get; set; }

    public string CourseCode { get; set; } = null!;

    public string CourseName { get; set; } = null!;

    public string CourseSession { get; set; } = null!;

    public string LecturerId { get; set; } = null!;

    public bool? CourseActive { get; set; }

    public bool? IsDeleted { get; set; }

    public string? AttendanceCodeMode { get; set; }

    public int? AttendanceCodeDuration { get; set; }

    public string? ClassDay { get; set; }

    public virtual ICollection<AttendanceRecord> AttendanceRecords { get; set; } = new List<AttendanceRecord>();

    public virtual ICollection<EnrolledStudent> EnrolledStudents { get; set; } = new List<EnrolledStudent>();

    public virtual Programme Programme { get; set; } = null!;

    public virtual CourseSemester Semester { get; set; } = null!;

    public virtual ICollection<Tutorial> Tutorials { get; set; } = new List<Tutorial>();

    public virtual ICollection<StudentAttendance> StudentAttendances { get; set; } = new List<StudentAttendance>();
}
