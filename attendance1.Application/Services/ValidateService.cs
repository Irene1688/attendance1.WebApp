namespace attendance1.Application.Services
{
    public class ValidateService : BaseService, IValidateService
    {
        private readonly IProgrammeRepository _programmeRepository;
        private readonly IUserRepository _userRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly IAttendanceRepository _attendanceRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ValidateService(ILogger<ValidateService> logger, IProgrammeRepository programmeRepository, IUserRepository userRepository, ICourseRepository courseRepository, IAttendanceRepository attendanceRepository, LogContext logContext, IHttpContextAccessor httpContextAccessor) 
            : base(logger, logContext)
        {
            _programmeRepository = programmeRepository ?? throw new ArgumentNullException(nameof(programmeRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _courseRepository = courseRepository ?? throw new ArgumentNullException(nameof(courseRepository));
            _attendanceRepository = attendanceRepository ?? throw new ArgumentNullException(nameof(attendanceRepository));
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<bool> HasPermissionToAccessCourseAsync(int courseId)
        {
            if (courseId <= 0)
                throw new InvalidOperationException("The class ID is required");

            var courseExists = await _courseRepository.HasCourseExistedAsync(courseId);
            if (!courseExists)
                throw new KeyNotFoundException("Class not found");

            if (_httpContextAccessor.HttpContext == null)
                throw new UnauthorizedAccessException("Not found user context");
            ClaimsPrincipal userClaims = _httpContextAccessor.HttpContext.User;
            
            var userRole = userClaims.FindFirst(ClaimTypes.Role)?.Value;
            if (userRole == null)
                throw new UnauthorizedAccessException("Not found user role");
            
            if (userRole == AccRoleEnum.Admin.ToString())
                return true;
            
            if (userRole == AccRoleEnum.Lecturer.ToString())
            {
                var userId = userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var lecturerId = userClaims.Claims
                    .Where(c => c.Type == ClaimTypes.NameIdentifier)
                    .Skip(1)
                    .Select(c => c.Value)
                    .FirstOrDefault();

                if (lecturerId == null || userId == null)
                    throw new KeyNotFoundException("Not found lecturer ID or user ID");

                var lecturerExists = await _userRepository.HasLecturerExistedAsync(lecturerId);
                if (!lecturerExists)
                    throw new KeyNotFoundException("Not found lecturer");
                
                var isPermitted = await _courseRepository.HasLecturerPermittedToAccessCourseAsync(lecturerId, int.Parse(userId), courseId);
                if (!isPermitted)
                    return false;

                return true;
            }

            return false;
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

        public async Task<bool> ValidateStudentIdWithUserIdAsync(string studentId, int userId)
        {
            if (string.IsNullOrEmpty(studentId) || userId <= 0)
                throw new KeyNotFoundException("The student ID and user ID are required");

            var studentExists = await _userRepository.CheckStudentIdWithUserIdAsync(studentId, userId);
            if (!studentExists)
                return false;

            return true;
        }

        public bool HasStudentIdMatchEmail(string studentId, string email)
        {
            if (string.IsNullOrEmpty(studentId) || string.IsNullOrEmpty(email))
                throw new InvalidOperationException("The student ID is required");

            var emailWithoutDomain = email.Split('@')[0];

            if (!studentId.Equals(emailWithoutDomain, StringComparison.OrdinalIgnoreCase))
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

        public async Task<bool> HasStudentInTheCourseAsync(int courseId, string studentId)
        {
            if (courseId <= 0)
                throw new InvalidOperationException("The course ID is required");
            if (string.IsNullOrEmpty(studentId))
                throw new InvalidOperationException("The student ID is required");

            var studentExists = await _courseRepository.HasStudentEnrolledInCourseAsync(studentId, courseId);
            if (!studentExists)
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