namespace attendance1.Application.Services
{
    public class CourseService : BaseService, ICourseService
    {
        private readonly IValidateService _validateService;
        private readonly IUserService _userService;
        private readonly ICourseRepository _courseRepository;
        private readonly IUserRepository _userRepository;
        private readonly IAttendanceRepository _attendanceRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CourseService(
            ILogger<CourseService> logger, 
            IValidateService validateService, 
            IUserService userService,
            ICourseRepository courseRepository, 
            IUserRepository userRepository, 
            IAttendanceRepository attendanceRepository, 
            IHttpContextAccessor httpContextAccessor,
            LogContext logContext)
            : base(logger, logContext)
        {
            _validateService = validateService ?? throw new ArgumentNullException(nameof(validateService));
            _courseRepository = courseRepository ?? throw new ArgumentNullException(nameof(courseRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
            _attendanceRepository = attendanceRepository ?? throw new ArgumentNullException(nameof(attendanceRepository));
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        }

        #region private methods
        private async Task<(List<string>, List<string>, List<string>)> ProcessStudentListCsvFile(IFormFile file)
        {
            var studentIdList = new List<string>();
            var studentNameList = new List<string>();
            var tutorialNameList = new List<string>();

            using (var reader = new StreamReader(file.OpenReadStream()))
            {
                // 跳过标题行
                var headerLine = await reader.ReadLineAsync();
                if (headerLine == null)
                    throw new InvalidOperationException("CSV file is empty");

                // 验证标题行
                var headers = headerLine.Split(',')
                    .Select(h => h.Trim().ToLower())
                    .ToList();
                
                if (!headers.Contains("studentid") || !headers.Contains("studentname") || !headers.Contains("tutorialname"))
                    throw new InvalidOperationException("CSV file must contain columns: studentId, studentName, tutorialName");

                // 读取数据行
                string line;
                int rowNumber = 2; // 从第2行开始计数
                while ((line = await reader.ReadLineAsync()) != null)
                {
                    if (string.IsNullOrWhiteSpace(line)) continue;

                    var values = line.Split(',')
                        .Select(v => v.Trim())
                        .ToList();

                    if (values.Count != headers.Count)
                        throw new InvalidOperationException($"Invalid data format at row {rowNumber}");

                    // 获取列索引
                    var studentIdIndex = headers.IndexOf("studentid");
                    var studentNameIndex = headers.IndexOf("studentname");
                    var tutorialNameIndex = headers.IndexOf("tutorialname");

                    // 验证学生ID格式
                    var studentId = values[studentIdIndex];
                    if (!Regex.IsMatch(studentId, @"^[A-Z]{3}[0-9]{8}$"))
                        throw new InvalidOperationException($"Invalid student ID format at row {rowNumber}: {studentId}");

                    studentIdList.Add(studentId);
                    studentNameList.Add(values[studentNameIndex]);
                    tutorialNameList.Add(values[tutorialNameIndex]);
                    rowNumber++;
                }
            }

            if (!studentIdList.Any())
                throw new InvalidOperationException("No valid student records found in CSV file");
            
            return (studentIdList, studentNameList, tutorialNameList);
        }
        #endregion
        

        #region Course CRUD
        public async Task<Result<int>> CreateNewCourseAsync(CreateCourseRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                var lecturerUserId = 0;
                var programmeId = 0;

                if (requestDto.CreatedBy == AccRoleEnum.Admin)
                {
                    lecturerUserId = requestDto.UserId;
                    programmeId = requestDto.ProgrammeId;
                }

                if (requestDto.CreatedBy == AccRoleEnum.Lecturer)
                {
                    var userClaims = _httpContextAccessor.HttpContext?.User;
                    if (userClaims == null)
                        throw new InvalidOperationException("Invalid account status, please login again");
                    lecturerUserId = int.Parse(userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                    programmeId = await _userRepository.GetProgrammeIdByUserIdAsync(lecturerUserId);
                }

                if (!await _validateService.HasProgrammeAsync(programmeId))
                    throw new InvalidOperationException("Programme not found");
                if (!await _validateService.ValidateUserAsync(lecturerUserId))
                    throw new InvalidOperationException("Lecturer not found");

                var course = new Course 
                {
                    CourseCode = requestDto.CourseCode,
                    CourseName = requestDto.CourseName,
                    CourseSession = requestDto.CourseSession,
                    ClassDay = string.Join(",", requestDto.ClassDays),
                    ProgrammeId = programmeId,
                    UserId = lecturerUserId,
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

                var newCourseId = await _courseRepository.CreateNewCourseAsync(course, semester, tutorials);
                return newCourseId;
            },
            $"Failed to create new class");
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
                    //ProgrammeId = course.ProgrammeId,
                    ProgrammeName = course.Programme.ProgrammeName, 
                    //LecturerUserId = course.UserId ?? 0,
                    LecturerName = course.User != null 
                        ? course.User.UserName ?? string.Empty 
                        : string.Empty,
                    //ClassDay = course.ClassDay ?? string.Empty,
                    //StartDate = course.Semester.StartWeek,
                    //EndDate = course.Semester.EndWeek,
                    Status = course.Semester.EndWeek <= DateOnly.FromDateTime(DateTime.Now) ? "ARCHIVED" : "ACTIVE",
                    // Tutorials = course.Tutorials
                    //     .Where(t => t.IsDeleted == false)
                    //     .Select(t => new GetTutorialResponseDto
                    //     {
                    //         TutorialId = t.TutorialId,
                    //         TutorialName = t.TutorialName ?? string.Empty,
                    //         ClassDay = t.TutorialClassDay ?? string.Empty,
                    //         StudentCount = course.EnrolledStudents
                    //             .Where(s => 
                    //                 s.TutorialId == t.TutorialId &&
                    //                 s.IsDeleted == false
                    //             ).Count(),
                    //     }).ToList(),
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

        public async Task<Result<GetActiveCourseSelectionResponseDto>> GetActiveCourseSelectionByLecturerIdAsync(DataIdRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                if (!await _validateService.ValidateLecturerAsync(requestDto.IdInString ?? string.Empty))
                    throw new InvalidOperationException("Lecturer not found");

                var courses = await _courseRepository.GetActiveCourseSelectionByLecturerIdAsync(requestDto.IdInString ?? string.Empty);
                return new GetActiveCourseSelectionResponseDto
                {
                    Courses = courses.Select(c => new DataIdResponseDto
                    {
                        Id = c.CourseId,
                        Name = $"{c.CourseCode} - {c.CourseName}"
                    }).ToList()
                };
            }, "Failed to get active course selection by lecturer ID");
        }

        public async Task<Result<GetLecturerClassRequestDto>> GetActiveClassesOfLecturerAsync(DataIdRequestDto requestDto)
        {
            return await ExecuteAsync(
                async () =>
                {
                    if (!await _validateService.ValidateLecturerAsync(requestDto.IdInString ?? string.Empty))
                        throw new KeyNotFoundException($"Lecturer with ID {requestDto.IdInString} does not exist");

                    var courses = await _courseRepository.GetCoursesByLecturerIdAsync(requestDto.IdInString ?? string.Empty);
                    var response = new GetLecturerClassRequestDto
                    {
                        LecturerId = requestDto.IdInString ?? string.Empty,
                        Courses = courses
                            .Where(c => c.Semester.EndWeek >= DateOnly.FromDateTime(DateTime.Now))
                            .Select(c => new CourseDto
                            {
                                CourseId = c.CourseId,
                                CourseCode = c.CourseCode,
                                CourseName = c.CourseName,
                                CourseSession = c.CourseSession,
                                OnClassDay = c.ClassDay ?? string.Empty,
                                Tutorials = c.Tutorials
                                    .Where(t => t.IsDeleted == false)
                                    .Select(t => new TutorialDto
                                    {
                                        TutorialId = t.TutorialId,
                                        TutorialName = t.TutorialName ?? string.Empty,
                                        ClassDay = t.TutorialClassDay ?? string.Empty,
                                    }).ToList()
                            }).ToList()
                    };
                    return response;
                },
                $"Error occurred while getting the classes of lecturer {requestDto.IdInString}"
            );
        }

        public async Task<Result<GetCourseDetailsResponseDto>> GetCourseDetailsAsync(DataIdRequestDto requestDto)
        {
            return await ExecuteAsync(
                async () =>
                {
                    if (!await _validateService.HasPermissionToAccessCourseAsync(requestDto.IdInInteger ?? 0))
                        throw new UnauthorizedAccessException("You are not permitted to access this class");

                    var classDetails = await _courseRepository.GetCourseDetailsAsync(requestDto.IdInInteger ?? 0);
                    return new GetCourseDetailsResponseDto 
                    {
                        CourseId = classDetails.CourseId,
                        Lecturer = new UserDto 
                        {
                            UserId = classDetails.UserId ?? 0,
                            UserName = classDetails.User?.UserName ?? string.Empty,
                            CampusId = classDetails.LecturerId ?? string.Empty,
                        },
                        CourseCode = classDetails.CourseCode,
                        CourseName = classDetails.CourseName,
                        CourseSession = classDetails.CourseSession,
                        ClassDay = classDetails.ClassDay ?? string.Empty,
                        Tutorials = classDetails.Tutorials
                            .Where(t => t.IsDeleted == false)
                            .Select(t => new TutorialDto
                            {
                                TutorialId = t.TutorialId,
                                TutorialName = t.TutorialName ?? string.Empty,
                                ClassDay = t.TutorialClassDay ?? string.Empty,
                                StudentCount = classDetails.EnrolledStudents
                                    .Where(s => 
                                        s.TutorialId == t.TutorialId && 
                                        s.IsDeleted == false)
                                    .Count()
                            }).ToList(),
                        Programme = new ProgrammeDto
                        {
                            ProgrammeId = classDetails.Programme.ProgrammeId,
                            ProgrammeName = classDetails.Programme.ProgrammeName
                        },
                        Semester = new SemesterDto
                        {
                            SemesterId = classDetails.Semester.SemesterId,
                            StartDate = classDetails.Semester.StartWeek,
                            EndDate = classDetails.Semester.EndWeek
                        },
                        Status = classDetails.Semester.EndWeek <= DateOnly.FromDateTime(DateTime.Now) ? "ARCHIVED" : "ACTIVE",
                    };
                },
                $"Error occurred while getting the class details"
            );
        }

        public async Task<Result<bool>> EditCourseAsync(EditCourseRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                if (!await _validateService.HasPermissionToAccessCourseAsync(requestDto.CourseId))
                    throw new UnauthorizedAccessException("You are not permitted to access this class");

                var programmeId = 0;
                var lecturerUserId = 0;
                if (requestDto.UpdatedBy == AccRoleEnum.Admin)
                {
                    programmeId = requestDto.ProgrammeId;
                    lecturerUserId = requestDto.LecturerUserId;
                }

                if (requestDto.UpdatedBy == AccRoleEnum.Lecturer)
                {
                    var userClaims = _httpContextAccessor.HttpContext?.User;
                    if (userClaims == null)
                        throw new InvalidOperationException("Invalid account status, please login again");
                    lecturerUserId = int.Parse(userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                    programmeId = await _userRepository.GetProgrammeIdByUserIdAsync(lecturerUserId);
                }

                if (!await _validateService.HasProgrammeAsync(programmeId))
                    throw new InvalidOperationException("Programme not found");
                if (!await _validateService.ValidateUserAsync(lecturerUserId))
                    throw new InvalidOperationException("Lecturer not found");

                var lecturerId = await _userRepository.GetLecturerIdByUserIdAsync(lecturerUserId);
                
                var course = new Course 
                {
                    CourseId = requestDto.CourseId,
                    CourseCode = requestDto.CourseCode,
                    CourseName = requestDto.CourseName,
                    CourseSession = requestDto.CourseSession,
                    ClassDay = string.Join(",", requestDto.ClassDays),
                    ProgrammeId = programmeId,
                    UserId = lecturerUserId,
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

                if (!await _validateService.HasPermissionToAccessCourseAsync(requestDto.Id))
                    throw new UnauthorizedAccessException("You are not permitted to access this class");

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

                var permissionChecks = courseIds.Select(async id => await _validateService.HasPermissionToAccessCourseAsync(id));
                var results = await Task.WhenAll(permissionChecks);

                if (results.Any(hasPermission => !hasPermission))
                    throw new UnauthorizedAccessException("You are not permitted to access this class");
                
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
                    if (!await _validateService.HasPermissionToAccessCourseAsync(requestDto.CourseId))
                        throw new UnauthorizedAccessException("You are not permitted to access this class");
                    
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
                    if (orderBy == "attendancerate" && isAscending)
                        responseData = responseData.OrderBy(r => r.AttendanceRate).ToArray();
                    else if (orderBy == "attendancerate" && !isAscending)
                        responseData = responseData.OrderByDescending(r => r.AttendanceRate).ToArray();
                    
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
                    if (!await _validateService.HasPermissionToAccessCourseAsync(requestDto.CourseId))
                        throw new UnauthorizedAccessException("You are not permitted to access this class");

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
                if (!await _validateService.HasPermissionToAccessCourseAsync(requestDto.CourseId))
                    throw new UnauthorizedAccessException("You are not permitted to access this class");
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

        public async Task<Result<bool>> AddSingleStudentToCourseAsync(AddStudentToCourseWithoutUserIdRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                if (!await _validateService.HasPermissionToAccessCourseAsync(requestDto.CourseId))
                    throw new UnauthorizedAccessException("You are not permitted to access this class");
                if (!await _validateService.ValidateTutorialAsync(requestDto.TutorialId, requestDto.CourseId))
                    throw new KeyNotFoundException("Tutorial not found");
                if (await _validateService.HasStudentInTheCourseAsync(requestDto.CourseId, requestDto.StudentId))
                    throw new InvalidOperationException("Student already exists in the class");

                if (!await _validateService.ValidateStudentAsync(requestDto.StudentId))
                {
                    var programmeId = await _courseRepository.GetProgrammeIdOfCourseAsync(requestDto.CourseId);
                    var newStudentAccount = new CreateAccountRequestDto
                    {
                        CampusId = requestDto.StudentId,
                        Name = requestDto.StudentName,
                        ProgrammeId = programmeId,
                        Email = $"{requestDto.StudentId.ToLower()}@student.uts.edu.my",
                        Password = requestDto.StudentId.ToLower(),
                        Role = AccRoleEnum.Student,
                    };
                    var createAccountTask = await _userService.CreateSingleStudentAccountsAsync(newStudentAccount);
                    if (!createAccountTask.Success)
                        throw new Exception("Failed to create student's account");
                }

                var newEnrollment = new EnrolledStudent
                {
                    CourseId = requestDto.CourseId,
                    StudentId = requestDto.StudentId,
                    StudentName = requestDto.StudentName,
                    TutorialId = requestDto.TutorialId,
                    IsDeleted = false,
                };
                return await _courseRepository.AddSingleStudentToCourseAsync(newEnrollment);
            }, $"Failed to add student to class");
        }

        public async Task<Result<bool>> AddStudentsByCsvToCourseAsync(int courseId, IFormFile file)
        {
            return await ExecuteAsync(async () =>
            {
                if (!await _validateService.HasPermissionToAccessCourseAsync(courseId))
                    throw new UnauthorizedAccessException("You are not permitted to access this class");
                if (file == null || file.Length == 0)
                    throw new InvalidOperationException("File is empty");
                    
                var (studentIdList, studentNameList, tutorialNameList) = await ProcessStudentListCsvFile(file);
                var programmeId = await _courseRepository.GetProgrammeIdOfCourseAsync(courseId);
                
                // process student: create student accounts
                var studentAccounts = studentIdList.Select(studentId => new CreateAccountRequestDto
                {
                    CampusId = studentId,
                    Name = studentNameList[studentIdList.IndexOf(studentId)],
                    ProgrammeId = programmeId,
                    Email = $"{studentId.ToLower()}@student.uts.edu.my",
                    Password = studentId.ToLower(),
                    Role = AccRoleEnum.Student
                }).ToList();
                var createAccountTask = await _userService.CreateMultipleStudentAccountsAsync(studentAccounts, programmeId);
                if (!createAccountTask.Success)
                    throw new Exception("Failed to create students' accounts.");

                // process student: add students to course
                foreach (var studentId in studentIdList)
                {
                    if (await _validateService.HasStudentInTheCourseAsync(courseId, studentId))
                        throw new InvalidOperationException("Student(s) already exist in the class");
                }

                var courseTutorials = await _courseRepository.GetCourseTutorialsAsync(courseId);
                var newEnrollments = studentIdList.Select(studentId => new EnrolledStudent 
                { 
                    CourseId = courseId,
                    StudentId = studentId,
                    StudentName = studentNameList[studentIdList.IndexOf(studentId)],
                    TutorialId = courseTutorials
                        .FirstOrDefault(t => 
                            t.TutorialName?.Equals(tutorialNameList[studentIdList.IndexOf(studentId)], StringComparison.OrdinalIgnoreCase) == true
                        )?.TutorialId ?? 0,
                    IsDeleted = false,
                }).ToList();
                
                return await _courseRepository.AddMultipleStudentsToCourseAsync(newEnrollments);
            }, $"Failed to add students to class");
        }

        public async Task<Result<bool>> RemoveStudentFromCourseAsync(RemoveStudentFromCourseRequestDto requestDto)
        {
            return await ExecuteAsync(
                async () =>
                {
                    if (!await _validateService.HasPermissionToAccessCourseAsync(requestDto.CourseId))
                        throw new UnauthorizedAccessException("You are not permitted to access this class");

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

        #region Student fetch Course
        public async Task<Result<List<GetStudentEnrolledCourseSelectionResponseDto>>> GetEnrolledCourseSelectionByStudentIdAsync(DataIdRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                if (!await _validateService.ValidateStudentAsync(requestDto.IdInString ?? string.Empty))
                    throw new KeyNotFoundException("Student not found");

                var courses = await _courseRepository.GetEnrollmentCoursesByStudentIdAsync(requestDto.IdInString ?? string.Empty);

                return courses
                    .Where(c => c.IsDeleted == false)
                    .Select(c => new GetStudentEnrolledCourseSelectionResponseDto
                    {
                        CourseId = c.CourseId,
                        CourseCode = c.CourseCode,
                        CourseName = c.CourseName,
                        IsActive = c.Semester.EndWeek >= DateOnly.FromDateTime(DateTime.Now)
                    }).ToList();
            }, $"Error occurred while getting the active classes");
        }

        public async Task<Result<GetEnrolledCourseDetailWithEnrolledTutorialResponseDto>> GetCourseDetailsWithEnrolledTutorialAsync(DataIdRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                if (!await _validateService.ValidateCourseAsync(requestDto.IdInInteger ?? 0))
                    throw new KeyNotFoundException("Class not found");
                if (!await _validateService.ValidateStudentAsync(requestDto.IdInString ?? string.Empty))
                    throw new KeyNotFoundException("Student not found");
                if (!await _validateService.HasStudentInTheCourseAsync(requestDto.IdInInteger ?? 0, requestDto.IdInString ?? string.Empty))
                    throw new UnauthorizedAccessException("You are not enrolled in the class");

                var classDetails = await _courseRepository.GetCourseDetailsAsync(requestDto.IdInInteger ?? 0);
                var studentEnrolledTutorialId = classDetails.EnrolledStudents
                    .FirstOrDefault(s => s.StudentId == requestDto.IdInString)
                    ?.TutorialId ?? 0;
                
                return new GetEnrolledCourseDetailWithEnrolledTutorialResponseDto 
                {
                    CourseId = classDetails.CourseId,
                    LecturerName = classDetails.User?.UserName ?? string.Empty,
                    CourseCode = classDetails.CourseCode,
                    CourseName = classDetails.CourseName,
                    CourseSession = classDetails.CourseSession,
                    ProgrammeName = classDetails.Programme.ProgrammeName,
                    EnrolledTutorial = classDetails.Tutorials
                        .Where(t => 
                            t.IsDeleted == false && 
                            t.TutorialId == studentEnrolledTutorialId)
                        .Select(t => new TutorialDto
                        {
                            TutorialId = t.TutorialId,
                            TutorialName = t.TutorialName ?? string.Empty,
                            ClassDay = t.TutorialClassDay ?? string.Empty,
                        }).FirstOrDefault() ?? new TutorialDto(),
                };
            }, $"Error occurred while getting the course details");

        }
        // public async Task<Result<GetStudentEnrolledCourseSelectionResponseDto>> GetEnrolledCourseSelectionByStudentIdAsync(DataIdRequestDto requestDto)
        // {
        //     return await ExecuteAsync(async () =>
        //     {
        //         if (!await _validateService.ValidateStudentAsync(requestDto.IdInString ?? string.Empty))
        //             throw new KeyNotFoundException("Student not found");

        //         var courses = await _courseRepository.GetEnrollmentCoursesByStudentIdAsync(requestDto.IdInString ?? string.Empty);
        //         var studentTutorials = await _courseRepository.GetTutorialsByStudentIdAsync(requestDto.IdInString ?? string.Empty);
        //         return courses
        //             .Where(c => 
        //                 c.Semester.EndWeek >= DateOnly.FromDateTime(DateTime.Now) &&
        //                 c.IsDeleted == false)
        //             .Select(c => new GetStudentActiveCourseResponseDto
        //             {
        //                 CourseId = c.CourseId,
        //                 CourseCode = c.CourseCode,
        //                 CourseName = c.CourseName,
        //                 ClassDay = c.ClassDay ?? string.Empty,
        //                 LecturerName = c.User?.UserName ?? string.Empty,
        //                 Tutorials = c.Tutorials
        //                 .Where(t => 
        //                     t.IsDeleted == false &&
        //                     studentTutorials.Any(st => st.TutorialId == t.TutorialId))
        //                 .Select(t => new TutorialDto
        //                 {
        //                     TutorialId = t.TutorialId,
        //                     TutorialName = t.TutorialName ?? string.Empty,
        //                     ClassDay = t.TutorialClassDay ?? string.Empty,
        //                 }).ToList()
        //             }).ToList();
        //     }, $"Error occurred while getting the active courses");
        // }
        #endregion
    }
}