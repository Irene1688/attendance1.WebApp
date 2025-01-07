using attendance1.Domain.Entities;

namespace attendance1.Domain.Interfaces
{
    public interface IUserRepository
    {
        #region validate
        Task<bool> HasLecturerExistedAsync(string lecturerId);
        Task<bool> HasStudentExistedAsync(string studentId);
        Task<bool> HasUserExistedAsync(int userId);
        #endregion

        # region login
        Task<UserDetail?> GetUserByEmailAsync(string email);
        Task<List<UserDetail>> GetStaffByUsernameAsync(string username, string role);
        #endregion

        #region CRUD
        Task<int> GetTotalLecturerAsync();
        Task<int> GetTotalStudentAsync();
        Task<List<UserDetail>> GetAllLecturerAsync(int pageNumber = 1, int pageSize = 15);
        Task<List<UserDetail>> GetAllStudentAsync(int pageNumber = 1, int pageSize = 15);
        Task<List<string>> GetAllExistedStudentIdAsync();
        Task<UserDetail> GetUserByCampusIdAsync(int userId, string campusId);
        Task<bool> CreateUserAsync(UserDetail userDetail);
        Task<bool> CreateMultipleUserAsync(List<UserDetail> userDetails);
        Task<bool> EditUserAsync(UserDetail userDetail);
        Task<bool> EditUserWithPasswordAsync(UserDetail userDetail); // admin only
        Task<bool> ChangeUserPasswordAsync(int userId, string newPassword);
        Task<bool> DeleteUserAsync(int userId);
        #endregion

        #region get one property
        Task<string> GetLecturerNameByLecturerIdAsync(string lecturerId);
        Task<string> GetStudentNameByStudentIdAsync(string studentId);
        Task<string> GetUserPasswordByUserIdAsync(int userId);
        #endregion

        #region refresh token
        Task<UserDetail?> GetUserByRefreshTokenAsync(string refreshToken);
        Task<bool> UpdateUserRefreshTokenAsync(UserDetail user, string newRefreshToken, DateTime? expiryTime);
        #endregion
    }
}
