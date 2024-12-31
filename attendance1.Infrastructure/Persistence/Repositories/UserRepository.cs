using attendance1.Application.Common.Enum;
using attendance1.Domain.Entities;
using attendance1.Domain.Interfaces;
using attendance1.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace attendance1.Infrastructure.Persistence.Repositories
{
    public class UserRepository : BaseRepository, IUserRepository
    {
        public UserRepository(ILogger<UserRepository> logger, ApplicationDbContext database)
            : base(logger, database)
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
            var user = await _database.UserDetails
                .FirstOrDefaultAsync(u => u.Email == email 
                    && u.IsDeleted == false);

            return user;
        }
        #endregion

        #region User CRUD
        public async Task<List<UserDetail>> GetAllLecturerAsync(int pageNumber = 1, int pageSize = 15)
        {
            return await _database.UserDetails
                .Where(u => u.AccRole == AccRoleEnum.Lecturer.ToString() 
                    && u.IsDeleted == false)
                .OrderBy(u => u.LecturerId)
                .AsNoTracking()
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<List<UserDetail>> GetAllStudentAsync(int pageNumber = 1, int pageSize = 15)
        {
            return await _database.UserDetails
                .Where(u => u.AccRole == AccRoleEnum.Student.ToString() 
                    && u.IsDeleted == false)
                .OrderBy(u => u.StudentId)
                .AsNoTracking()
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<List<string>> GetAllExistedStudentIdAsync()
        {
            return await _database.UserDetails
                .Where(u => u.AccRole == AccRoleEnum.Student.ToString() 
                    && u.IsDeleted == false)
                .Select(u => u.StudentId ?? string.Empty)
                .ToListAsync();
        }

        public async Task<UserDetail> GetUserByCampusIdAsync(int userId, string campusId)
        {
            var user = await _database.UserDetails
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.UserId == userId 
                    && u.IsDeleted == false 
                    && (u.StudentId == campusId || u.LecturerId == campusId));
            if (user == null)
                throw new Exception("User not found");
            return user;
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
            var lecturer = await _database.UserDetails
                .Where(u => u.LecturerId == lecturerId 
                    && u.AccRole == AccRoleEnum.Lecturer.ToString())
                .Select(u => u.UserName)
                .FirstOrDefaultAsync();
            if (lecturer == null)
                throw new Exception("Lecturer not found");
            return lecturer;
        }
        
        public async Task<string> GetStudentNameByStudentIdAsync(string studentId)
        {
            var student = await _database.UserDetails
                .Where(u => u.StudentId == studentId 
                    && u.AccRole == AccRoleEnum.Student.ToString()
                    && u.IsDeleted == false)
                .Select(u => u.UserName)
                .FirstOrDefaultAsync();

            if (student == null)
                throw new Exception("Student not found");

            return student;
        }
        
        public async Task<string> GetUserPasswordByUserIdAsync(int userId)
        {
            var password = await _database.UserDetails
                .Where(u => u.UserId == userId 
                    && u.IsDeleted == false)
                .Select(u => u.UserPassword)
                .FirstOrDefaultAsync();
            if (password == null)
                throw new Exception("User not found");
            return password;
        }
        #endregion

        #region refresh token
        public async Task<UserDetail?> GetUserByRefreshTokenAsync(string refreshToken)
        {
            return await _database.UserDetails
                .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken
                && u.IsDeleted == false);
        }

        public async Task UpdateUserRefreshTokenAsync(UserDetail user)
        {
            _database.UserDetails.Update(user);
            await _database.SaveChangesAsync();
        }
        #endregion
    }
}
