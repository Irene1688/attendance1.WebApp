namespace attendance1.Application.Services
{
    public class LectureService : BaseService, ILectureService
    {
        private readonly IValidateService _validateService;
        private readonly IUserRepository _userRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly IAttendanceRepository _attendanceRepository;

        public LectureService(ILogger<LectureService> logger, IValidateService validateService, IUserRepository userRepository, ICourseRepository courseRepository, IAttendanceRepository attendanceRepository, LogContext logContext) 
            : base(logger, logContext)
        {
            _validateService = validateService ?? throw new ArgumentNullException(nameof(validateService));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _courseRepository = courseRepository ?? throw new ArgumentNullException(nameof(courseRepository));
            _attendanceRepository = attendanceRepository ?? throw new ArgumentNullException(nameof(attendanceRepository));
        }

        public async Task<Result<bool>> RemoveStudentFromTutorialAsync(RemoveStudentFromTutorialRequestDto requestDto)
        {
            if (!await _validateService.ValidateCourseAsync(requestDto.CourseId))
                return Result<bool>.FailureResult($"Course with ID {requestDto.CourseId} does not exist.", HttpStatusCode.NotFound);

            if (!await _validateService.ValidateTutorialAsync(requestDto.TutorialId, requestDto.CourseId))
                return Result<bool>.FailureResult($"Tutorial with ID {requestDto.TutorialId} does not exist.", HttpStatusCode.NotFound);

            return await ExecuteAsync(
                async () =>
                {
                    return await _courseRepository.RemoveStudentFromTutorialAsync(requestDto.TutorialId, requestDto.CourseId, requestDto.StudentIdList);
                },
                $"Error occurred while removing student from tutorial {requestDto.TutorialId}"
            );
        }

        public async Task<Result<List<GetAttendanceWithStudentNameResponseDto>>> GetAttendanceByCodeIdAsync(DataIdRequestDto requestDto)
        {
            var attendanceCodeId = requestDto.IdInInteger ?? 0;
            if (!await _validateService.ValidateAttendanceCodeAsync(attendanceCodeId))
                return Result<List<GetAttendanceWithStudentNameResponseDto>>.FailureResult($"This attendance code does not exist.", HttpStatusCode.NotFound);

            return await ExecuteAsync(
                async () =>
                {
                    var attendanceData = await _attendanceRepository.GetAttendanceDataByAttendanceCodeIdAsync(attendanceCodeId);
                    var processStudentNameTask = attendanceData
                        .Select(async a => new GetAttendanceWithStudentNameResponseDto
                        {
                            StudentId = a.StudentId,
                            StudentName = await _userRepository.GetStudentNameByStudentIdAsync(a.StudentId),
                            DateAndTime = a.DateAndTime
                        }).ToList();
                    var response = await Task.WhenAll(processStudentNameTask);
                    return response.ToList();
                },
                "Error occurred while getting attendance data"
            );
        }
    }
}


