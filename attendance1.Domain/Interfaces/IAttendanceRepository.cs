using attendance1.Domain.Entities;

namespace attendance1.Domain.Interfaces
{
    public interface IAttendanceRepository
    {
        #region validate
        Task<bool> HasAttendanceCodeExistedByIdAsync(int attendanceCodeId);
        Task<bool> HasAttendanceRecordExistedAsync(string studentId, int attendanceCodeId);
        #endregion
        
        #region lecturer: attendace CRUD
        Task<bool> CreateAttendanceCodeAsync(AttendanceRecord attendanceRecord);
        Task<List<StudentAttendance>> GetAttendanceDataByCourseIdAsync(int courseId);
        Task<List<StudentAttendance>> GetAttendanceDataByAttendanceCodeIdAsync(int attendanceRecordId);
        Task<bool> InsertAbsentStudentAttendanceAsync(int courseId, int attendanceCodeId);
        Task<bool> ChangeAttendanceDataAsync(IEnumerable<StudentAttendance> newAttendanceData);
        #endregion
        
        #region student: view attendance
        Task<List<StudentAttendance>> GetAttendanceDataByStudentIdAsync(string studentId);
        Task<AttendanceRecord> GetAttendanceCodeDetailsByCodeAsync(string attendanceCode);
        Task<bool> CreateAttendanceDataAsync(StudentAttendance studentAttendance);
        #endregion

        // maybe no use
        Task<bool> InsertAttendanceDataOfStudentAsync(IEnumerable<StudentAttendance> studentAttendance);
        // maybe no use
        Task<bool> RemoveAttendanceDataOfStudentAsync(IEnumerable<int> attendanceId);
    }
}
