namespace attendance1.Application.Services
{
    public class AdminService : BaseService, IAdminService
    {
        private readonly IValidateService _validateService;
        private readonly IProgrammeRepository _programmeRepository;
        private readonly IUserRepository _userRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly IAttendanceRepository _attendanceRepository;

        public AdminService(ILogger<AdminService> logger, IValidateService validateService, IProgrammeRepository programmeRepository, IUserRepository userRepository, ICourseRepository courseRepository, IAttendanceRepository attendanceRepository, LogContext logContext)
            : base(logger, logContext)
        {
            _validateService = validateService ?? throw new ArgumentNullException(nameof(validateService));
            _programmeRepository = programmeRepository ?? throw new ArgumentNullException(nameof(programmeRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _courseRepository = courseRepository ?? throw new ArgumentNullException(nameof(courseRepository));
            _attendanceRepository = attendanceRepository ?? throw new ArgumentNullException(nameof(attendanceRepository));
        }

        public async Task<Result<AllTotalCountResponseDto>> GetAllTotalCountAsync()
        {
            return await ExecuteAsync(async () =>
            {
                var counts = await Task.WhenAll(
                    _programmeRepository.GetTotalProgrammeAsync(),
                    _userRepository.GetTotalLecturerAsync(),
                    _userRepository.GetTotalStudentAsync(),
                    _courseRepository.GetTotalCourseAsync()
                );

                return new AllTotalCountResponseDto
                {
                    TotalProgrammes = counts[0],
                    TotalLecturers = counts[1],
                    TotalStudents = counts[2],
                    TotalCourses = counts[3],
                };
            }, "Failed to get total count of data");
        }
    }
}