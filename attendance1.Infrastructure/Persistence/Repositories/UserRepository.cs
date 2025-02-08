using attendance1.Application.Common.Enum;
using attendance1.Application.Common.Logging;
using attendance1.Domain.Entities;
using attendance1.Domain.Interfaces;
using attendance1.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using attendance1.Application.Extensions;

namespace attendance1.Infrastructure.Persistence.Repositories
{
    public class UserRepository : BaseRepository, IUserRepository
    {
        public UserRepository(ILogger<UserRepository> logger, 
            IDbContextFactory<ApplicationDbContext> contextFactory, 
            LogContext logContext)
            : base(logger, contextFactory, logContext)
        {
        }

        #region validate
        public async Task<bool> HasLecturerExistedAsync(string lecturerId)
        {
            var IsExisted = await _database.UserDetails
                .AnyAsync(u => u.AccRole == AccRoleEnum.Lecturer.ToString() 
                    && u.LecturerId == lecturerId 
                    && u.IsDeleted == false);
            return IsExisted;
        }

        public async Task<bool> HasStudentExistedAsync(string studentId)
        {
            var IsExisted = await _database.UserDetails
                .AnyAsync(u => u.AccRole == AccRoleEnum.Student.ToString() 
                    && u.StudentId == studentId 
                    && u.IsDeleted == false);
            return IsExisted;
        }

        public async Task<bool> HasUserExistedAsync(int userId)
        {
            var IsExisted = await _database.UserDetails
                .AnyAsync(u => u.UserId == userId && u.IsDeleted == false);
            return IsExisted;
        }

        public async Task<bool> HasEmailExistedAsync(string email)
        {
            var IsExisted = await _database.UserDetails
                .AnyAsync(u => u.Email == email && u.IsDeleted == false);
            return IsExisted;
        }

        public async Task<bool> CheckEmailWithUserIdAsync(string email, int userId)
        {
            var EmailCorrect = await _database.UserDetails
                .AnyAsync(u => 
                    u.Email == email && 
                    u.UserId == userId && 
                    u.IsDeleted == false);
            return EmailCorrect;
        }
        
        public async Task<bool> CheckStudentIdWithUserIdAsync(string studentId, int userId)
        {
            var StudentCorrect = await _database.UserDetails
                .AnyAsync(u => 
                    u.StudentId == studentId && 
                    u.UserId == userId && 
                    u.IsDeleted == false);
            return StudentCorrect;
        }
        #endregion

        #region login
        public async Task<UserDetail?> GetUserByEmailAsync(string email)
        {
            return await ExecuteGetAsync(async () => await _database.UserDetails
                .FirstOrDefaultAsync(u => u.Email == email 
                    && u.IsDeleted == false));
        }
        
        public async Task<List<UserDetail>> GetStaffByUsernameAsync(string username, string role)
        {
            return await ExecuteGetAsync(async () => await _database.UserDetails
                .Where(u => u.UserName == username 
                    && u.AccRole == role
                    && u.IsDeleted == false)
                .ToListAsync());
        }
        #endregion

        #region User CRUD
        public async Task<int> GetTotalLecturerAsync(string searchTerm = "")
        {
            var query = _database.UserDetails
                .Where(u => 
                    u.AccRole == AccRoleEnum.Lecturer.ToString() &&
                    u.IsDeleted == false)
                .AsNoTracking();

            if (!string.IsNullOrEmpty(searchTerm))
            {
                searchTerm = searchTerm.ToLower();
                query = query.Where(p =>
                    EF.Functions.Collate(p.UserName ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm) ||
                    EF.Functions.Collate(p.LecturerId ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm) ||
                    EF.Functions.Collate(p.Email ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm));
            }

            return await query.CountAsync();
        }

        public async Task<List<(int id, string name)>> GetLecturerSelectionAsync()
        {
            return await ExecuteGetAsync(async () => 
                await _database.UserDetails
                    .Where(u => 
                        u.AccRole == AccRoleEnum.Lecturer.ToString() && 
                        u.IsDeleted == false)
                    .Select(u => new { u.UserId, UserName = u.UserName ?? string.Empty })
                    .ToListAsync()
                    .ContinueWith(t => 
                        t.Result.Select(x => (id: x.UserId, name: x.UserName)).ToList()));
        }

        public async Task<int> GetTotalStudentAsync(string searchTerm = "")
        {
            var query = _database.UserDetails
                .Where(u => 
                    u.AccRole == AccRoleEnum.Student.ToString() &&
                    u.IsDeleted == false)
                .AsNoTracking();

            if (!string.IsNullOrEmpty(searchTerm))
            {
                searchTerm = searchTerm.ToLower();
                query = query.Where(p =>
                    EF.Functions.Collate(p.UserName ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm) ||
                    EF.Functions.Collate(p.StudentId ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm) ||
                    EF.Functions.Collate(p.Email ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm));
            }

            return await query.CountAsync();
        }

        public async Task<List<UserDetail>> GetAllLecturerAsync(
            int pageNumber = 1, 
            int pageSize = 15, 
            string searchTerm = "", 
            string orderBy = "lecturername", 
            bool isAscending = true
        )
        {
            var query = _database.UserDetails
                .Where(u => 
                    u.AccRole == AccRoleEnum.Lecturer.ToString() &&
                    u.IsDeleted == false)
                .Include(u => u.Programme)
                .AsNoTracking();

            if (!string.IsNullOrEmpty(searchTerm)) 
            {
                searchTerm = searchTerm.ToLower();
                query = query.Where(p => 
                    EF.Functions.Collate(p.UserName ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm) ||
                    EF.Functions.Collate(p.LecturerId ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm) ||
                    EF.Functions.Collate(p.Programme.ProgrammeName ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm) ||
                    EF.Functions.Collate(p.Email ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm));
            }

            var orderedQuery = orderBy.ToLower() switch
            {
                "lecturername" => isAscending 
                    ? query.OrderBy(p => p.UserName) 
                    : query.OrderByDescending(p => p.UserName),
                "lecturerid" => isAscending 
                    ? query.OrderBy(p => p.LecturerId) 
                    : query.OrderByDescending(p => p.LecturerId),
                "email" => isAscending 
                    ? query.OrderBy(p => p.Email) 
                    : query.OrderByDescending(p => p.Email),
                "programme" => isAscending 
                    ? query.OrderBy(p => p.Programme.ProgrammeName) 
                    : query.OrderByDescending(p => p.Programme.ProgrammeName),
                _ => query.OrderBy(p => p.UserName)
            };

            return await ExecuteGetAsync(async () => await orderedQuery
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync());
        }

        public async Task<List<UserDetail>> GetAllStudentAsync(
            int pageNumber = 1, 
            int pageSize = 15,
            string searchTerm = "",
            string orderBy = "studentname",
            bool isAscending = true
        )
        {
            var query = _database.UserDetails
                .Where(u => 
                    u.AccRole == AccRoleEnum.Student.ToString() &&
                    u.IsDeleted == false)
                .Include(u => u.Programme)
                .AsNoTracking();

            if (!string.IsNullOrEmpty(searchTerm)) 
            {
                searchTerm = searchTerm.ToLower();
                query = query.Where(p => 
                    EF.Functions.Collate(p.UserName ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm) ||
                    EF.Functions.Collate(p.StudentId ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm) ||
                    EF.Functions.Collate(p.Email ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm) ||
                    EF.Functions.Collate(p.Programme.ProgrammeName ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm));
            }

            var orderedQuery = orderBy.ToLower() switch
            {
                "studentname" => isAscending 
                    ? query.OrderBy(p => p.UserName) 
                    : query.OrderByDescending(p => p.UserName),
                "studentid" => isAscending 
                    ? query.OrderBy(p => p.StudentId) 
                    : query.OrderByDescending(p => p.StudentId),
                "email" => isAscending 
                    ? query.OrderBy(p => p.Email) 
                    : query.OrderByDescending(p => p.Email),
                "programme" => isAscending 
                    ? query.OrderBy(p => p.Programme.ProgrammeName) 
                    : query.OrderByDescending(p => p.Programme.ProgrammeName),
                _ => query.OrderBy(p => p.UserName)
            };

            return await ExecuteGetAsync(async () => await orderedQuery
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync());
        }

        public async Task<List<string>> GetAllExistedStudentIdinProgrammeAsync(int programmeId)
        {
            return await ExecuteGetAsync(async () => await _database.UserDetails
                .Where(u => 
                    u.AccRole == AccRoleEnum.Student.ToString() && 
                    u.IsDeleted == false &&
                    u.ProgrammeId == programmeId)
                .Select(u => u.StudentId ?? string.Empty)
                .ToListAsync());
        }


        public async Task<UserDetail> GetUserByCampusIdAsync(string role, string campusId)
        {
            return await ExecuteGetAsync(async () => await _database.UserDetails
                .AsNoTracking()
                .Include(u => u.Programme)
                .FirstOrDefaultAsync(u => 
                    u.IsDeleted == false &&
                    u.AccRole == role &&
                    (u.StudentId == campusId || u.LecturerId == campusId)));
        }

        public async Task<bool> CreateUserAsync(UserDetail userDetail)
        {   
            return await ExecuteWithTransactionAsync(async () =>
            {
                await _database.UserDetails.AddAsync(userDetail);
                await _database.SaveChangesAsync();
                return true;
            });
        }

        public async Task<bool> CreateMultipleUserAsync(List<UserDetail> userDetails)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                await _database.UserDetails.AddRangeAsync(userDetails);
                await _database.SaveChangesAsync();
                return true;
            });
        }

        public async Task<bool> EditUserAsync(UserDetail userDetail)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                var user = await _database.UserDetails
                    .FirstOrDefaultAsync(u => 
                        u.UserId == userDetail.UserId && 
                        u.IsDeleted == false);
        
                if (user == null)
                    throw new Exception("User not found");

                user.UserName = userDetail.UserName;
                user.Email = userDetail.Email;
                user.StudentId = userDetail.StudentId;
                await _database.SaveChangesAsync();
                return true;
            });
        }

        public async Task<bool> EditUserWithPasswordAsync(UserDetail userDetail)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                var userToEdit = await _database.UserDetails
                    .FirstOrDefaultAsync(u => 
                        u.UserId == userDetail.UserId && 
                        u.IsDeleted == false);

                if (userToEdit == null)
                    throw new Exception("User not found");

                userToEdit.UserName = userDetail.UserName;
                userToEdit.Email = userDetail.Email;
                if (!string.IsNullOrEmpty(userDetail.UserPassword))
                    userToEdit.UserPassword = userDetail.UserPassword;
                await _database.SaveChangesAsync();
                return true;
            });
        }
        // admin only
        // public async Task<bool> EditUserWithPasswordAsync(UserDetail userDetail)
        // {
        //     return await ExecuteWithTransactionAsync(async () =>
        //     {
        //         var user = await _database.UserDetails
        //             .FirstOrDefaultAsync(u => u.UserId == userDetail.UserId 
        //                 && u.IsDeleted == false);
        
        //         if (user == null)
        //             throw new Exception("User not found");

        //         user.UserName = userDetail.UserName;
        //         user.Email = userDetail.Email;
        //         user.AccRole = userDetail.AccRole;
        //         user.StudentId = userDetail.StudentId;
        //         user.LecturerId = userDetail.LecturerId;
        //         user.UserPassword = userDetail.UserPassword;
        //         await _database.SaveChangesAsync();
        //         return true;
        //     });
        // }

        public async Task<bool> ChangeUserPasswordAsync(int userId, string newPassword)
        {
            return await ExecuteWithTransactionAsync( async () =>
            {
                var user = await _database.UserDetails
                    .FirstOrDefaultAsync(u => u.UserId == userId
                        && u.IsDeleted == false);
                if (user == null)
                    throw new Exception("User not found");
                user.UserPassword = newPassword;
                await _database.SaveChangesAsync();
                return true;
            });
        }
        
        public async Task<bool> DeleteUserAsync(int userId)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                var user = await _database.UserDetails
                    .FirstOrDefaultAsync(u => u.UserId == userId
                        && u.IsDeleted == false);

                if (user == null)
                    throw new Exception("User not found");

                user.IsDeleted = true;
                await _database.SaveChangesAsync();
                return true;
            });
        }
        
        public async Task<bool> MultipleDeleteUserAsync(List<int> userIds)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                var usersToDelete = await _database.UserDetails
                    .Where(u => 
                        userIds.Contains(u.UserId) && 
                        u.IsDeleted == false)
                    .ToListAsync();

                foreach (var user in usersToDelete)
                {
                    user.IsDeleted = true;
                }
                await _database.SaveChangesAsync();
                return true;
            });
        }
        #endregion

        #region Get one property
        public async Task<int> GetProgrammeIdByUserIdAsync(int userId)
        {
            return await ExecuteGetAsync(async () => 
                await _database.UserDetails
                    .Where(u => 
                        u.UserId == userId && 
                        u.IsDeleted == false)
                    .Select(u => u.ProgrammeId)
                    .FirstOrDefaultAsync());
        }
        public async Task<string> GetLecturerIdByUserIdAsync(int userId)
        {
            return await ExecuteGetAsync(async () => await _database.UserDetails
                .Where(u => u.UserId == userId 
                    && u.AccRole == AccRoleEnum.Lecturer.ToString())
                .Select(u => u.LecturerId)
                .FirstOrDefaultAsync());
        }

        public async Task<string> GetLecturerNameByLecturerIdAsync(string lecturerId)
        {
            return await ExecuteGetAsync(async () => await _database.UserDetails
                .Where(u => u.LecturerId == lecturerId 
                    && u.AccRole == AccRoleEnum.Lecturer.ToString())
                .Select(u => u.UserName)
                .FirstOrDefaultAsync());
        }
        
        public async Task<string> GetStudentNameByStudentIdAsync(string studentId)
        {
            return await ExecuteGetAsync(async () => await _database.UserDetails
                .Where(u => u.StudentId == studentId 
                    && u.AccRole == AccRoleEnum.Student.ToString()
                    && u.IsDeleted == false)
                .Select(u => u.UserName)
                .FirstOrDefaultAsync());
        }
        
        public async Task<string> GetUserPasswordByUserIdAsync(int userId)
        {   
            return await ExecuteGetAsync(async () => await _database.UserDetails
                .Where(u => u.UserId == userId 
                    && u.IsDeleted == false)
                .Select(u => u.UserPassword)
                .FirstOrDefaultAsync());
        }
        #endregion

        #region refresh token
        public async Task<UserDetail?> GetUserByRefreshTokenAsync(string refreshToken)
        {
            return await ExecuteGetAsync(async () => await _database.UserDetails
                .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken
                && u.IsDeleted == false));
        }

        public async Task<bool> UpdateUserRefreshTokenAsync(UserDetail user, string newRefreshToken, DateTime? expiryTime)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                var thisUser = await _database.UserDetails
                    .AsTracking()
                    .FirstOrDefaultAsync(u => u.IsDeleted == false 
                        && u.UserId == user.UserId);
                    
                if (thisUser == null)
                    throw new KeyNotFoundException(nameof(thisUser));
                
                thisUser.RefreshToken = newRefreshToken;
                if (expiryTime != null)
                    thisUser.RefreshTokenExpiryTime = expiryTime;

                await _database.SaveChangesAsync();
                return true;
            });
        }
        #endregion

        public async Task<StudentDevice> GetFingerprintByStudentIdAsync(string studentId)
        {
            return await ExecuteGetAsync(async () => {
                var device = await _database.StudentDevices
                    .FirstOrDefaultAsync(d =>
                        d.StudentId == studentId &&
                        d.IsActive == true);
                if (device == null)
                    return new StudentDevice();
                return device;
            });
        }

        public async Task<bool> SaveFingerprintOfStudentAsync(StudentDevice fingerprint)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                // Deactivate existing device bindings
                var existingDevices = await _database.StudentDevices
                    .Where(d => d.StudentId == fingerprint.StudentId)
                    .ToListAsync();
                    
                foreach (var device in existingDevices)
                {
                    device.IsActive = false;
                }

                // Add new device binding
                await _database.StudentDevices.AddAsync(fingerprint);
                await _database.SaveChangesAsync();
                return true;
            });
        }

        public async Task<bool> ResetFingerprintOfStudentAsync(string studentId)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                var fingerprint = await _database.StudentDevices.FirstOrDefaultAsync(d => d.StudentId == studentId && d.IsActive == true);
                if (fingerprint == null)
                    throw new Exception("No bound device found");
                fingerprint.IsActive = false;
                await _database.SaveChangesAsync();
                return true;
            });
        }

        public async Task<StudentDevice> GetDeviceByFingerprintHashAsync(string fingerprintHash)
        {
            return await ExecuteGetAsync(async () => {
                var device = await _database.StudentDevices
                    .FirstOrDefaultAsync(d => 
                        d.FingerprintHash == fingerprintHash && 
                        d.IsActive == true);
                if (device == null)
                    return new StudentDevice();
                return device;
            });
        }

    }
}
