namespace attendance1.Application.Services
{
    public class CourseService : BaseService, ICourseService
    {
        private readonly IValidateService _validateService;
        private readonly ICourseRepository _courseRepository;
        private readonly IUserRepository _userRepository;
        private readonly IAttendanceRepository _attendanceRepository;

        public CourseService(
            ILogger<CourseService> logger, 
            IValidateService validateService, 
            ICourseRepository courseRepository, 
            IUserRepository userRepository, 
            IAttendanceRepository attendanceRepository, 
            LogContext logContext)
            : base(logger, logContext)
        {
            _validateService = validateService ?? throw new ArgumentNullException(nameof(validateService));
            _courseRepository = courseRepository ?? throw new ArgumentNullException(nameof(courseRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _attendanceRepository = attendanceRepository ?? throw new ArgumentNullException(nameof(attendanceRepository));
        }

        #region Course CRUD
        public async Task<Result<bool>> CreateNewCourseAsync(CreateCourseRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                if (!await _validateService.ValidateUserAsync(requestDto.UserId))
                    throw new InvalidOperationException("Lecturer not found");

                var course = new Course 
                {
                    CourseCode = requestDto.CourseCode,
                    CourseName = requestDto.CourseName,
                    CourseSession = requestDto.CourseSession,
                    ClassDay = string.Join(",", requestDto.ClassDays),
                    ProgrammeId = requestDto.ProgrammeId,
                    UserId = requestDto.UserId,
                    IsDeleted = false,
                };

                var semester = new CourseSemester
                {
                    StartWeek = requestDto.CourseStartFrom,
                    EndWeek = requestDto.CourseEndTo,
                    IsDeleted = false,
                };

                var tutorials = requestDto.Tutorials.Select(t => new Tutorial
                {
                    TutorialName = t.TutorialName,
                    TutorialClassDay = t.ClassDay.ToString(),
                    IsDeleted = false,
                }).ToList();

                var students = new List<EnrolledStudent>();
                await _courseRepository.CreateNewCourseAsync(course, semester, tutorials, students);
                return true;
            },
            $"Failed to create new course: {requestDto.CourseName}");
        }

        public async Task<Result<PaginatedResult<GetCourseResponseDto>>> GetAllCourseAsync(GetCourseRequestDto requestDto)
        {
            var pageNumber = requestDto.PaginatedRequest.PageNumber;
            var pageSize = requestDto.PaginatedRequest.PageSize;
            var searchTerm = requestDto.SearchTerm;
            var orderBy = requestDto.PaginatedRequest.OrderBy;
            var isAscending = requestDto.PaginatedRequest.IsAscending;

            var filters = requestDto.Filters != null ? new Dictionary<string, object>
            {
                { "programmeId", requestDto.Filters.ProgrammeId ?? 0 },
                { "lecturerUserId", requestDto.Filters.LecturerUserId ?? 0 },
                { "status", requestDto.Filters.Status ?? string.Empty },
                { "session", requestDto.Filters.Session ?? string.Empty }
            } : null;
            
            return await ExecuteAsync(async () =>
            {
                var courses = await _courseRepository.GetAllCourseAsync(pageNumber, pageSize, searchTerm, orderBy, isAscending, filters);
                var processCoursesTask = courses.Select(course => new GetCourseResponseDto
                {
                    CourseId = course.CourseId,
                    CourseCode = course.CourseCode,
                    CourseName = course.CourseName,
                    CourseSession = course.CourseSession,
                    ProgrammeId = course.ProgrammeId,
                    ProgrammeName = course.Programme.ProgrammeName, 
                    LecturerUserId = course.UserId ?? 0,
                    LecturerName = course.User != null 
                        ? course.User.UserName ?? string.Empty 
                        : string.Empty,
                    ClassDay = course.ClassDay ?? string.Empty,
                    StartDate = course.Semester.StartWeek,
                    EndDate = course.Semester.EndWeek,
                    Status = course.Semester.EndWeek <= DateOnly.FromDateTime(DateTime.Now) ? "ARCHIVED" : "ACTIVE",
                    Tutorials = course.Tutorials
                        .Where(t => t.IsDeleted == false)
                        .Select(t => new GetTutorialResponseDto
                        {
                            TutorialId = t.TutorialId,
                            TutorialName = t.TutorialName ?? string.Empty,
                            ClassDay = t.TutorialClassDay ?? string.Empty,
                            StudentCount = course.EnrolledStudents
                                .Where(s => 
                                    s.TutorialId == t.TutorialId &&
                                    s.IsDeleted == false
                                ).Count(),
                        }).ToList(),
                }).ToList();

                //var response = await Task.WhenAll(processCoursesTask);
                
                var paginatedResult = new PaginatedResult<GetCourseResponseDto>(
                    processCoursesTask.ToList(), 
                    await _courseRepository.GetTotalCourseAsync(searchTerm, filters),
                    pageNumber, 
                    pageSize
                );
                return paginatedResult;
            }, 
            "Failed to get all courses");
        }

        public async Task<Result<bool>> EditCourseAsync(EditCourseRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                if (!await _validateService.ValidateCourseAsync(requestDto.CourseId))
                    throw new KeyNotFoundException("Course not found");

                var lecturerId = await _userRepository.GetLecturerIdByUserIdAsync(requestDto.LecturerUserId);
                
                var course = new Course 
                {
                    CourseId = requestDto.CourseId,
                    CourseCode = requestDto.CourseCode,
                    CourseName = requestDto.CourseName,
                    CourseSession = requestDto.CourseSession,
                    ClassDay = string.Join(",", requestDto.ClassDays),
                    ProgrammeId = requestDto.ProgrammeId,
                    UserId = requestDto.LecturerUserId,
                    LecturerId = lecturerId,
                    IsDeleted = false,
                };

                var semester = new CourseSemester
                {
                    StartWeek = requestDto.CourseStartFrom,
                    EndWeek = requestDto.CourseEndTo,
                    IsDeleted = false,
                };

                var tutorials = requestDto.Tutorials.Select(t => new Tutorial
                {
                    TutorialId = t.TutorialId,
                    TutorialName = t.TutorialName,
                    TutorialClassDay = t.ClassDay.ToString(),
                    IsDeleted = false,
                }).ToList();

                var isSuccess = await _courseRepository.EditCourseAsync(course, semester);
                if (!isSuccess)
                    throw new Exception("Cancelled editing course");

                var isSuccessTutorials = await _courseRepository.EditCourseTutorialsAsync(course.CourseId, tutorials);
                if (!isSuccessTutorials)
                    throw new Exception("Cancelled editing tutorials");

                return true;
            },
            $"Failed to edit course");
        }

        public async Task<Result<bool>> DeleteCourseAsync(DeleteRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                if (!await _validateService.ValidateCourseAsync(requestDto.Id))
                    throw new KeyNotFoundException("Course not found");

                await _courseRepository.DeleteCourseAsync(requestDto.Id);
                return true;
            },
            $"Failed to delete the course");

        }

        public async Task<Result<bool>> MultipleDeleteCourseAsync(List<DeleteRequestDto> requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                var courseIds = requestDto.Select(r => r.Id).ToList();
                if (courseIds.Count == 0)
                    throw new InvalidOperationException("No course IDs provided");
                if (courseIds.Any(id => id <= 0))
                    throw new InvalidOperationException("Invalid course ID found");
                
                await _courseRepository.MultipleDeleteCourseAsync(courseIds);
                return true;
            },
            $"Failed to delete the courses");
        }
        #endregion

        #region Course Student CRUD
        public async Task<Result<PaginatedResult<GetEnrolledStudentResponseDto>>> GetEnrolledStudentsAsync(GetEnrolledStudentRequestDto requestDto)
        {
            var pageNumber = requestDto.PaginatedRequest.PageNumber;
            var pageSize = requestDto.PaginatedRequest.PageSize;
            var searchTerm = requestDto.SearchTerm;
            var orderBy = requestDto.PaginatedRequest.OrderBy;
            var isAscending = requestDto.PaginatedRequest.IsAscending;

            return await ExecuteAsync(
                async () =>
                {
                    if (!await _validateService.ValidateCourseAsync(requestDto.CourseId))
                        throw new KeyNotFoundException("Course not found.");
                    
                    var enrolledStudents = await _courseRepository.GetEnrolledStudentsAsync(requestDto.CourseId, pageNumber, pageSize, searchTerm, orderBy, isAscending);
                    
                    var calculateAttendanceRateTasks = enrolledStudents.Select(async student =>
                    {
                        var task = _attendanceRepository.GetAttendanceRateOfStudentAsync(student.StudentId, requestDto.CourseId);

                        return new GetEnrolledStudentResponseDto
                        {
                            StudentId = student.StudentId,
                            StudentName = student.StudentName,
                            TutorialName = student.Tutorial?.TutorialName ?? string.Empty,
                            AttendanceRate = await task
                        };
                    });
                    var responseData = await Task.WhenAll(calculateAttendanceRateTasks);
                    
                    var paginatedResult = new PaginatedResult<GetEnrolledStudentResponseDto>(
                        responseData, 
                        await _courseRepository.GetTotalEnrolledStudentsAsync(requestDto.CourseId, searchTerm),
                        pageNumber, 
                        pageSize
                    );
                    return paginatedResult;
                },
                $"Error occurred while getting the enrolled students"
            );
        }

        public async Task<Result<GetAvailableStudentResponseDto>> GetAvailableStudentsAsync(GetAvailableStudentRequestDto requestDto)
        {
            return await ExecuteAsync(
                async () =>
                {
                    if (!await _validateService.ValidateCourseAsync(requestDto.CourseId))
                        throw new KeyNotFoundException("Course not found.");
                    
                    if (!await _validateService.HasProgrammeAsync(requestDto.ProgrammeId))
                        throw new KeyNotFoundException("Programme not found.");

                    var availableStudents = await _courseRepository.GetAvailableStudentsAsync(requestDto.ProgrammeId, requestDto.CourseId);
                    var response = new GetAvailableStudentResponseDto
                    {
                        Students = availableStudents.Select(s => new DataIdResponseDto
                        {
                            Id = s.UserId,
                            Name = $"{s.StudentId} - {s.UserName}"
                        }).ToList()
                    };
                return response;
                },
                $"Error occurred while getting the available students"
            );
        }

        public async Task<Result<bool>> AddStudentsToCourseAndTutorialAsync(AddStudentsToCourseRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                if (!await _validateService.ValidateCourseAsync(requestDto.CourseId))
                    throw new KeyNotFoundException("Course not found");
                if (!await _validateService.ValidateTutorialAsync(requestDto.TutorialId, requestDto.CourseId))
                    throw new KeyNotFoundException("Tutorial not found");
                if (requestDto.StudentUserIds.Count == 0)
                    throw new InvalidOperationException("No students provided");

                var success = await _courseRepository.AddStudentsToCourseByUserIdAsync(requestDto.CourseId, requestDto.TutorialId, requestDto.StudentUserIds);
                if (!success)
                    throw new Exception("Cancelled adding students to course");
                
                return true;
            }, $"Failed to add students to course");
        }

        public async Task<Result<bool>> RemoveStudentFromCourseAsync(RemoveStudentFromCourseRequestDto requestDto)
        {
            return await ExecuteAsync(
                async () =>
                {
                    if (!await _validateService.ValidateCourseAsync(requestDto.CourseId))
                        throw new KeyNotFoundException($"Class not found.");

                    if (requestDto.StudentIdList.Count == 0)
                        throw new InvalidOperationException("Student ID list is empty.");

                    if (requestDto.StudentIdList.Any(s => string.IsNullOrEmpty(s)))
                        throw new InvalidOperationException("Student ID list contains empty string.");

                    return await _courseRepository.RemoveStudentFromClassAsync(requestDto.CourseId, requestDto.StudentIdList);
                },
                $"Failed to remove student from class"
            );
        }
        #endregion
    }
}