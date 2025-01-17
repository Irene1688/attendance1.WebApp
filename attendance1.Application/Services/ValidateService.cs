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

        public async Task<bool> ValidateEmailAsync(string email)
        {
            if (string.IsNullOrEmpty(email))
                throw new InvalidOperationException("The email is required");

            var emailExists = await _userRepository.HasEmailExistedAsync(email);
            if (!emailExists)
                return false;

            return true;
        }

        public async Task<bool> ValidateEmailWithUserIdAsync(string email, int userId)
        {
            if (string.IsNullOrEmpty(email) || userId <= 0)
                throw new InvalidOperationException("The email and user ID are required");

            var emailCorrect = await _userRepository.CheckEmailWithUserIdAsync(email, userId);
            if (!emailCorrect)
                return false;

            return true;
        }

        public async Task<bool> ValidateLecturerAsync(string lecturerId)
        {
            if (string.IsNullOrEmpty(lecturerId))
                throw new InvalidOperationException("The lecturer ID is required");

            var lecturerExists = await _userRepository.HasLecturerExistedAsync(lecturerId);
            if (!lecturerExists)
                return false;

            return true;
        }

        public async Task<bool> ValidateStudentAsync(string studentId)
        {
            if (string.IsNullOrEmpty(studentId))
               throw new InvalidOperationException("The student ID is required");

            var studentExists = await _userRepository.HasStudentExistedAsync(studentId);
            if (!studentExists)
                return false;

            return true;
        }

        public async Task<bool> ValidateCourseAsync(int courseId)
        {
            if (courseId <= 0)
                throw new InvalidOperationException("The course ID is required");

            var courseExists = await _courseRepository.HasCourseExistedAsync(courseId);
            if (!courseExists)
                return false;

            return true;
        }

        public async Task<bool> ValidateTutorialAsync(int tutorialId, int courseId)
        {
            if (tutorialId <= 0 || courseId <= 0)
                throw new InvalidOperationException("The tutorial ID and course ID are required");

            var tutorialExists = await _courseRepository.HasTutorialExistedAsync(tutorialId, courseId);
            if (!tutorialExists)
                return false;

            return true;
        }
        
        public async Task<bool> ValidateAttendanceCodeAsync(int attendanceCodeId)
        {
            if (attendanceCodeId <= 0)
                throw new InvalidOperationException("The attendance code ID is required");

            var attendanceCodeExists = await _attendanceRepository.HasAttendanceCodeExistedByIdAsync(attendanceCodeId);
            if (!attendanceCodeExists)
                return false;

            return true;
        }

        public async Task<bool> ValidateUserAsync(int userId)
        {
            if (userId <= 0)
                throw new InvalidOperationException("The user ID is required");

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
            if (userId <= 0)
                throw new InvalidOperationException("The user ID is required");
            
            if (string.IsNullOrEmpty(oldPassword))
                throw new InvalidOperationException("The old password is required");

            var userPassword = await _userRepository.GetUserPasswordByUserIdAsync(userId);

            return BCrypt.Net.BCrypt.Verify(oldPassword, userPassword);
        }

        public async Task<bool> HasProgrammeAsync(int programmeId)
        {
            if (programmeId <= 0)
                throw new InvalidOperationException("The programme ID is required");

            var programmeExists = await _programmeRepository.HasProgrammeExistedAsync(programmeId);
            if (!programmeExists)
                return false;

            return true;
        }
    
        public async Task<bool> HasProgrammeNameExistedAsync(string programmeName)
        {
            if (string.IsNullOrEmpty(programmeName))
                throw new InvalidOperationException("The programme name is required");

            var programmeExists = await _programmeRepository.HasProgrammeNameExistedAsync(programmeName);
            if (!programmeExists)
                return false;

            return true;
        }
    }
}