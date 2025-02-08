namespace attendance1.Domain.Entities;

public partial class StudentDevice
{
    public int DeviceId { get; set; }
    public int? UserId { get; set; }
    public string StudentId { get; set; } = null!;
    public string FingerprintHash { get; set; } = null!;
    public DateOnly BindDate { get; set; }
    public bool IsActive { get; set; } = true;
    
    public virtual UserDetail Student { get; set; } = null!;
}
