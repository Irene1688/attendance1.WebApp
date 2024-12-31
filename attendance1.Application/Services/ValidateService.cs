using attendance1.Application.Common.Logging;
using attendance1.Application.Common.Response;
using attendance1.Application.DTOs.Common;
using attendance1.Application.Interfaces;
using attendance1.Domain.Entities;
using attendance1.Domain.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Logging;
using System.Net;

namespace attendance1.Application.Services
{
    public class ValidateService : BaseService, IValidateService
    {
        private readonly IProgrammeRepository _programmeRepository;
        private readonly IUserRepository _userRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly IAttendanceRepository _attendanceRepository;

        public ValidateService(ILogger<ValidateService> logger, IProgrammeRepository programmeRepository, IUserRepository userRepository, ICourseRepository courseRepository, IAttendanceRepository attendanceRepository, LogContext logContext) 
            : base(logger, logContext)
        {
            _programmeRepository = programmeRepository ?? throw new ArgumentNullException(nameof(programmeRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _courseRepository = courseRepository ?? throw new ArgumentNullException(nameof(courseRepository));
            _attendanceRepository = attendanceRepository ?? throw new ArgumentNullException(nameof(attendanceRepository));
        }

        public async Task<bool> ValidateLecturerAsync(string lecturerId)
        {
            if (string.IsNullOrEmpty(lecturerId))
                return false;

            var lecturerExists = await _userRepository.HasLecturerExistedAsync(lecturerId);
            if (!lecturerExists)
                return false;

            return true;
        }

        public async Task<bool> ValidateStudentAsync(string studentId)
        {
            if (string.IsNullOrEmpty(studentId))
                return false;

            var studentExists = await _userRepository.HasStudentExistedAsync(studentId);
            if (!studentExists)
                return false;

            return true;
        }

        public async Task<bool> ValidateCourseAsync(int courseId)
        {
            if (courseId <= 0)
                return false;

            var courseExists = await _courseRepository.HasCourseExistedAsync(courseId);
            if (!courseExists)
                return false;

            return true;
        }

        public async Task<bool> ValidateTutorialAsync(int tutorialId, int courseId)
        {
            if (tutorialId <= 0 || courseId <= 0)
                return false;

            var tutorialExists = await _courseRepository.HasTutorialExistedAsync(tutorialId, courseId);
            if (!tutorialExists)
                return false;

            return true;
        }
        
        public async Task<bool> ValidateAttendanceCodeAsync(int attendanceCodeId)
        {
            if (attendanceCodeId <= 0)
                return false;

            var attendanceCodeExists = await _attendanceRepository.HasAttendanceCodeExistedByIdAsync(attendanceCodeId);
            if (!attendanceCodeExists)
                return false;

            return true;
        }

        public async Task<bool> ValidateUserAsync(int userId)
        {
            if (userId <= 0)
                return false;

            var userExists = await _userRepository.HasUserExistedAsync(userId);
            if (!userExists)
                return false;

            return true;
        }

        public bool ValidatePasswordAsync(string oldPassword, string newPassword)
        {
            if (string.IsNullOrEmpty(oldPassword) || string.IsNullOrEmpty(newPassword))
                return false;

            return true;
        }

        public async Task<bool> ValidateOldPasswordCorrectAsync(int userId, string oldPassword)
        {
            var userPassword = await _userRepository.GetUserPasswordByUserIdAsync(userId);

            return BCrypt.Net.BCrypt.Verify(oldPassword, userPassword);
        }

        public async Task<bool> HasProgrammeAsync(int programmeId)
        {
            if (programmeId <= 0)
                return false;

            var programmeExists = await _programmeRepository.HasProgrammeExistedAsync(programmeId);
            if (!programmeExists)
                return false;

            return true;
        }
    }
}