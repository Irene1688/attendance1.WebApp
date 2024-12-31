using System;
using System.Collections.Generic;

namespace attendance1.Domain.Entities;

public partial class StudentDevice
{
    public int DeviceId { get; set; }

    public string StudentId { get; set; } = null!;

    public string? DeviceCode { get; set; }

    public string? DeviceType { get; set; }

    public string? DeviceOs { get; set; }

    public string? MacAddress { get; set; }

    public DateOnly? BindDate { get; set; }

    public string? UuId { get; set; }

    public virtual ICollection<StudentAttendance> StudentAttendances { get; set; } = new List<StudentAttendance>();
}
