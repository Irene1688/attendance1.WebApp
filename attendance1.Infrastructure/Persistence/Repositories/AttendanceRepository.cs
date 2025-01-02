using attendance1.Application.Common.Logging;
using attendance1.Domain.Entities;
using attendance1.Domain.Interfaces;
using attendance1.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using attendance1.Application.Extensions;

namespace attendance1.Infrastructure.Persistence.Repositories
{
    public class AttendanceRepository : BaseRepository, IAttendanceRepository
    {
        public AttendanceRepository(ILogger<AttendanceRepository> logger, 
            IDbContextFactory<ApplicationDbContext> contextFactory, 
            LogContext logContext)
            : base(logger, contextFactory, logContext)
        {
        }

        public async Task<bool> InsertAttendanceDataOfStudentAsync(IEnumerable<StudentAttendance> studentAttendance)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                await _database.StudentAttendances.AddRangeAsync(studentAttendance);
                await _database.SaveChangesAsync();
                return true;
            });
        }

        public async Task<bool> RemoveAttendanceDataOfStudentAsync(IEnumerable<int> attendanceId)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                var attendancesToDelete = await _database.StudentAttendances
                    .Where(a => attendanceId.Contains(a.AttendanceId))
                    .ToListAsync();
                if (attendancesToDelete == null)
                    throw new Exception("Attendance record not found");

                _database.StudentAttendances.RemoveRange(attendancesToDelete);
                await _database.SaveChangesAsync();
                return true;
            });
        }
        
        #region validate
        public async Task<bool> HasAttendanceCodeExistedByIdAsync(int attendanceCodeId)
        {
            var isAttendanceCodeExisted = await _database.AttendanceRecords
                .AnyAsync(a => a.RecordId == attendanceCodeId);
            return isAttendanceCodeExisted;
        }

        public async Task<bool> HasAttendanceRecordExistedAsync(string studentId, int attendanceCodeId)
        {
            var isAttendanceRecordExisted = await _database.StudentAttendances
                .AnyAsync(a => a.StudentId == studentId 
                    && a.RecordId == attendanceCodeId 
                    && a.IsPresent == true);
            return isAttendanceRecordExisted;
        }
        #endregion
        
        #region lecturer: attendace CRUD
        public async Task<bool> CreateAttendanceCodeAsync(AttendanceRecord attendanceRecord)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                await _database.AttendanceRecords.AddAsync(attendanceRecord);
                await _database.SaveChangesAsync();
                return true;
            });
        }

        public async Task<List<StudentAttendance>> GetAttendanceDataByCourseIdAsync(int courseId)
        {
            _logger.LogInfoWithContext("Starting repo method", _logContext.GetUserInfo());
            var attendanceData = await _database.StudentAttendances
                .Where(a => a.CourseId == courseId)
                .AsNoTracking()
                .ToListAsync();
            _logger.LogInfoWithContext("Completed repo method", _logContext.GetUserInfo());
            return attendanceData;
        }

        public async Task<List<StudentAttendance>> GetAttendanceDataByAttendanceCodeIdAsync(int attendanceRecordId)
        {
            _logger.LogInfoWithContext("Starting repo method", _logContext.GetUserInfo());
            var attendanceData = await _database.StudentAttendances
                .Where(a => a.RecordId == attendanceRecordId)
                .AsNoTracking()
                .ToListAsync();
            _logger.LogInfoWithContext("Completed repo method", _logContext.GetUserInfo());
            return attendanceData;
        }
        
        public async Task<bool> InsertAbsentStudentAttendanceAsync(int courseId, int attendanceCodeId)
        {
            return await ExecuteWithTransactionAsync(async () =>    
            {
                var absentStudents = await _database.EnrolledStudents
                    .Where(s => s.CourseId == courseId 
                        && s.IsDeleted == false
                        && !_database.StudentAttendances.Any(a => a.CourseId == courseId 
                            && a.RecordId == attendanceCodeId 
                            && a.StudentId == s.StudentId 
                            && a.IsPresent == true))
                    .Select(s => new StudentAttendance
                    {
                        DateAndTime = DateTime.UtcNow,
                        CourseId = courseId,
                        RecordId = attendanceCodeId,
                        StudentId = s.StudentId,
                        IsPresent = false,
                        Remark = $"Absent for {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}"
                    })
                    .ToListAsync();

                if (absentStudents.Any())
                {
                    await _database.StudentAttendances.AddRangeAsync(absentStudents);
                    await _database.SaveChangesAsync();
                }

                return true;
            });
        }
        
        public async Task<bool> ChangeAttendanceDataAsync(IEnumerable<StudentAttendance> newAttendanceData)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                var courseId = newAttendanceData.First().CourseId;
                var recordId = newAttendanceData.First().RecordId;
                
                var attendanceDataToChange = await _database.StudentAttendances
                    .Where(a => a.CourseId == courseId 
                        && a.RecordId == recordId)
                    .ToListAsync();
                
                if (attendanceDataToChange == null)
                    throw new Exception("Attendance record not found");

                foreach (var attendance in attendanceDataToChange)
                {
                    var updatedData = newAttendanceData.FirstOrDefault(a => a.AttendanceId == attendance.AttendanceId);
                    if (updatedData != null)
                    {
                        attendance.IsPresent = updatedData.IsPresent;
                        attendance.Remark = updatedData.Remark;
                    }
                }

                await _database.SaveChangesAsync();
                return true;
            });
        }
        #endregion

        #region student: view & submit attendance
        public async Task<List<StudentAttendance>> GetAttendanceDataByStudentIdAsync(string studentId)
        {
            _logger.LogInfoWithContext("Starting repo method", _logContext.GetUserInfo());
            var attendanceData = await _database.StudentAttendances
                .Where(a => a.StudentId == studentId)
                .Include(a => a.Course)
                .Include(a => a.Record)
                .AsNoTracking()
                .ToListAsync();
            _logger.LogInfoWithContext("Completed repo method", _logContext.GetUserInfo());
            return attendanceData;
        }

        public async Task<AttendanceRecord> GetAttendanceCodeDetailsByCodeAsync(string attendanceCode)
        {
            _logger.LogInfoWithContext("Starting repo method", _logContext.GetUserInfo());
            var attendanceRecord = await _database.AttendanceRecords
                .OrderByDescending(a => a.RecordId)
                .Take(100)
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.AttendanceCode == attendanceCode);
            _logger.LogInfoWithContext("Completed repo method", _logContext.GetUserInfo());
            if (attendanceRecord == null)
                throw new Exception("Attendance code not found");

            return attendanceRecord;
        }

        public async Task<bool> CreateAttendanceDataAsync(StudentAttendance studentAttendance)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                await _database.StudentAttendances.AddAsync(studentAttendance);
                await _database.SaveChangesAsync();
                return true;
            });
        }
        #endregion
    }
}