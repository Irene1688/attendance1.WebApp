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

        #region attendance rate
        public async Task<double> GetAttendanceRateOfStudentAsync(string studentId, int courseId)
        {
            return await ExecuteGetAsync<double>(async () => 
            {
                var totalAttendance = await _database.StudentAttendances
                    .Where(a => 
                        a.CourseId == courseId && 
                        a.StudentId == studentId)
                    .AsNoTracking()
                    .ToListAsync();
                
                if (totalAttendance.Count == 0)
                    return 0;
                
                 var presentAttendance = totalAttendance
                    .Count(a => a.IsPresent == true);
                var attendanceRate = (double)presentAttendance / totalAttendance.Count;
                return attendanceRate;
            });
        }
        #endregion

        #region attendance record
        public async Task<List<AttendanceRecord>> GetAttendanceRecordByCourseIdAsync(int courseId)
        {
            return await ExecuteGetAsync(async () => await _database.AttendanceRecords
                .Where(a => a.CourseId == courseId)
                .Include(a => a.Tutorial)
                .AsNoTracking()
                .ToListAsync());
        }

        public async Task<List<AttendanceRecord>> GetCourseStudentAttendanceRecordsAsync(int courseId)
        {
            return await ExecuteGetAsync(async () =>
            {
                return await _database.AttendanceRecords
                    .Where(r => r.CourseId == courseId)
                    .Include(r => r.Tutorial)
                    .OrderByDescending(r => r.Date)
                    .ThenBy(r => r.StartTime)
                    .AsNoTracking()
                    .ToListAsync();
            });
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
            return await ExecuteGetAsync(async () => await _database.StudentAttendances
                .Where(a => a.CourseId == courseId)
                .AsNoTracking()
                .ToListAsync());
        }

        public async Task<List<StudentAttendance>> GetAttendanceDataByAttendanceCodeIdAsync(int attendanceRecordId)
        {
            return await ExecuteGetAsync(async () => await _database.StudentAttendances
                .Where(a => a.RecordId == attendanceRecordId)
                .AsNoTracking()
                .ToListAsync());
        }
        
        public async Task<bool> InsertStudentAttendanceAsync(int courseId, int attendanceCodeId, int tutorialId, bool isPresent)
        {
            return await ExecuteWithTransactionAsync(async () =>    
            {
                var attendanceCode = await _database.AttendanceRecords.FindAsync(attendanceCodeId);
                if (attendanceCode == null)
                    throw new Exception("Attendance code not found");

                var noAttendanceStudents = await _database.EnrolledStudents
                    .Where(s => s.CourseId == courseId
                        && (tutorialId <= 0 || s.TutorialId == tutorialId) 
                        && s.IsDeleted == false
                        && !_database.StudentAttendances.Any(a => a.CourseId == courseId 
                            && a.RecordId == attendanceCodeId 
                            && a.StudentId == s.StudentId 
                            && a.IsPresent == true))
                    .Select(s => new StudentAttendance
                    {
                        DateAndTime = attendanceCode.Date.ToDateTime(attendanceCode.StartTime.Value),
                        CourseId = courseId,
                        RecordId = attendanceCodeId,
                        StudentId = s.StudentId,
                        IsPresent = isPresent,
                        Remark = $"{(isPresent ? "Present" : "Absent")} for {attendanceCode.Date.ToDateTime(attendanceCode.StartTime.Value):yyyy-MM-dd HH:mm:ss}"

                    })
                    .ToListAsync();

                if (noAttendanceStudents.Any())
                {
                    await _database.StudentAttendances.AddRangeAsync(noAttendanceStudents);
                    await _database.SaveChangesAsync();
                }

                return true;
            });
        }

        public async Task<bool> InsertStudentPastAttendanceAsync(int courseId, List<AttendanceRecord> attendanceCodes, bool isPresent, List<string> studentIds)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                await _database.StudentAttendances.AddRangeAsync(attendanceCodes.SelectMany(attendanceCode => studentIds.Select(studentId => new StudentAttendance
                {
                    CourseId = courseId,
                    RecordId = attendanceCode.RecordId,
                    StudentId = studentId,
                    IsPresent = isPresent,
                    DateAndTime = attendanceCode.Date.ToDateTime(attendanceCode.StartTime.Value),
                    Remark = $"{(isPresent ? "Present" : "Absent")} for {attendanceCode.Date.ToDateTime(attendanceCode.StartTime.Value):yyyy-MM-dd HH:mm:ss}"
                })));
                await _database.SaveChangesAsync();
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
            return await ExecuteGetAsync(async () => await _database.StudentAttendances
                .Where(a => a.StudentId == studentId)
                .Include(a => a.Course)
                    .ThenInclude(c => c.User)
                .Include(a => a.Course)
                    .ThenInclude(c => c.Tutorials)
                .Include(a => a.Record)
                .AsNoTracking()
                .ToListAsync());
        }

        public async Task<AttendanceRecord> GetAttendanceCodeDetailsByCodeAsync(string attendanceCode)
        {
            return await ExecuteGetAsync(async () => 
            {
                var attendanceRecord = await _database.AttendanceRecords
                    .Where(a => 
                        a.Date == DateOnly.FromDateTime(DateTime.UtcNow.Date) &&
                        a.AttendanceCode == attendanceCode)
                    .AsNoTracking()
                    .FirstOrDefaultAsync();

                if (attendanceRecord == null)
                    throw new KeyNotFoundException("Attendance code not found");

                return attendanceRecord;
            });
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

        public async Task<bool> UpdateStudentAttendanceStatusAsync(int courseId, int attendanceCodeId, string studentId, bool isPresent)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                var attendanceCode = await _database.AttendanceRecords.FindAsync(attendanceCodeId);
                if (attendanceCode == null)
                    throw new Exception("Attendance code not found");

                var attendance = await _database.StudentAttendances
                    .FirstOrDefaultAsync(a => 
                        a.CourseId == courseId && 
                        a.RecordId == attendanceCodeId && 
                        a.StudentId == studentId);

                if (attendance == null)
                {
                    attendance = new StudentAttendance
                    {
                        DateAndTime = attendanceCode.Date.ToDateTime(attendanceCode.StartTime.Value),
                        CourseId = courseId,
                        RecordId = attendanceCodeId,
                        StudentId = studentId,
                        IsPresent = isPresent,
                        Remark = $"{(isPresent ? "Present" : "Absent")} for {attendanceCode.Date.ToDateTime(attendanceCode.StartTime.Value):yyyy-MM-dd HH:mm:ss}"
                    };
                    await _database.StudentAttendances.AddAsync(attendance);
                }

                attendance.IsPresent = isPresent;
                _database.StudentAttendances.Update(attendance);

                await _database.SaveChangesAsync();
                return true;
            });
        }
    }
}