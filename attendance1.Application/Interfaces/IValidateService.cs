namespace attendance1.Application.Interfaces
{
    public interface IValidateService
    {
        Task<bool> ValidateUserAsync(int userId);
        Task<bool> ValidateLecturerAsync(string lecturerId);
        Task<bool> ValidateStudentAsync(string studentId);

        Task<bool> ValidateCourseAsync(int courseId);
        Task<bool> ValidateTutorialAsync(int tutorialId, int courseId);

        Task<bool> ValidateAttendanceCodeAsync(int attendanceCodeId);

        bool ValidatePasswordAsync(string oldPassword, string newPassword);
        Task<bool> ValidateOldPasswordCorrectAsync(int userId, string oldPassword);

        Task<bool> HasProgrammeAsync(int programmeId);   
    }
}