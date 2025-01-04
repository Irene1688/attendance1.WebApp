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
        #endregion

        #region login
        public async Task<UserDetail?> GetUserByEmailAsync(string email)
        {
            return await ExecuteGetAsync(async () => await _database.UserDetails
                .FirstOrDefaultAsync(u => u.Email == email 
                    && u.IsDeleted == false));
        }
        #endregion

        #region User CRUD
        public async Task<List<UserDetail>> GetAllLecturerAsync(int pageNumber = 1, int pageSize = 15)
        {
            return await ExecuteGetAsync(async () => await _database.UserDetails
                .Where(u => u.AccRole == AccRoleEnum.Lecturer.ToString() 
                    && u.IsDeleted == false)
                .OrderBy(u => u.LecturerId)
                .AsNoTracking()
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync());
        }

        public async Task<List<UserDetail>> GetAllStudentAsync(int pageNumber = 1, int pageSize = 15)
        {
            return await ExecuteGetAsync(async () => await _database.UserDetails
                .Where(u => u.AccRole == AccRoleEnum.Student.ToString() 
                    && u.IsDeleted == false)
                .OrderBy(u => u.StudentId)
                .AsNoTracking()
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync());
        }

        public async Task<List<string>> GetAllExistedStudentIdAsync()
        {
            return await ExecuteGetAsync(async () => await _database.UserDetails
                .Where(u => u.AccRole == AccRoleEnum.Student.ToString() 
                    && u.IsDeleted == false)
                .Select(u => u.StudentId ?? string.Empty)
                .ToListAsync());
        }

        public async Task<UserDetail> GetUserByCampusIdAsync(int userId, string campusId)
        {
            return await ExecuteGetAsync(async () => await _database.UserDetails
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.UserId == userId 
                    && u.IsDeleted == false 
                    && (u.StudentId == campusId || u.LecturerId == campusId)));
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
                    .FirstOrDefaultAsync(u => u.UserId == userDetail.UserId 
                        && u.IsDeleted == false);
        
                if (user == null)
                    throw new Exception("User not found");

                user.UserName = userDetail.UserName;
                user.Email = userDetail.Email;
                user.StudentId = userDetail.StudentId;
                user.LecturerId = userDetail.LecturerId;
                await _database.SaveChangesAsync();
                return true;
            });
        }

        // admin only
        public async Task<bool> EditUserWithPasswordAsync(UserDetail userDetail)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                var user = await _database.UserDetails
                    .FirstOrDefaultAsync(u => u.UserId == userDetail.UserId 
                        && u.IsDeleted == false);
        
                if (user == null)
                    throw new Exception("User not found");

                user.UserName = userDetail.UserName;
                user.Email = userDetail.Email;
                user.AccRole = userDetail.AccRole;
                user.StudentId = userDetail.StudentId;
                user.LecturerId = userDetail.LecturerId;
                user.UserPassword = userDetail.UserPassword;
                await _database.SaveChangesAsync();
                return true;
            });
        }

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
        #endregion

        #region Get one property
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

        public async Task<bool> UpdateUserRefreshTokenAsync(UserDetail user)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                _database.UserDetails.Update(user);
                await _database.SaveChangesAsync();
                return true;
            });
        }
        #endregion

        #region staff login
        public async Task<List<UserDetail>> GetStaffByUsernameAsync(string username, string role)
        {
            return await ExecuteGetAsync(async () => await _database.UserDetails
                .Where(u => u.UserName == username 
                    && u.AccRole == role
                    && u.IsDeleted == false)
                .ToListAsync());
        }
        #endregion
    }
}
