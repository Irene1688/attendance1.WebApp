namespace attendance1.Application.Services
{
    public class AccountService : BaseService, IAccountService
    {
        private readonly IValidateService _validateService;
        private readonly ICourseRepository _courseRepository;
        private readonly IUserRepository _userRepository;
        private readonly IAttendanceRepository _attendanceRepository;

        public AccountService(
            ILogger<AccountService> logger, 
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

        private string FormatName(string name)
        {
            var match = Regex.Match(name, @"(.+?)(\s*\(.*\))?\s*(\d+)?$");
            
            var outsideBrackets = match.Groups[1].Value.Trim();
            var insideBrackets = match.Groups[2].Success ? match.Groups[2].Value : null;
            var number = match.Groups[3].Success ? match.Groups[3].Value : null;

            var formattedOutside = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(outsideBrackets.ToLower());

            var result = formattedOutside;
            if (insideBrackets != null)
            {
                result += " " + insideBrackets;
            }
            if (number != null)
            {
                result += " " + number;
            }

            return result;
        }

        public async Task<Result<bool>> CreateAdminAsync(CreateAccountRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                var admin = new UserDetail
                {
                    StudentId = null,
                    LecturerId = requestDto.CampusId,
                    ProgrammeId = null,
                    UserName = FormatName(requestDto.Name),
                    Email = requestDto.Email,
                    UserPassword = BCrypt.Net.BCrypt.HashPassword(requestDto.CampusId.ToLower()),
                    AccRole = AccRoleEnum.Admin.ToString(),
                    IsDeleted = false
                };
                await _userRepository.CreateUserAsync(admin);
                return true;
            }, "Failed to create admin account");
        }

        public async Task<Result<GetLecturerSelectionResponseDto>> GetLecturerSelectionAsync()
        {
            return await ExecuteAsync(async () =>
            {
                if (!_validateService.HasAdminPermissionAsync())
                    throw new UnauthorizedAccessException("You don't have permission to perform this action");

                var lecturers = await _userRepository.GetLecturerSelectionAsync();
                var response = new GetLecturerSelectionResponseDto
                {
                    Lecturers = lecturers.Select(l => new DataIdResponseDto
                    {
                        Id = l.id,
                        Name = l.name,  
                    }).ToList()
                };
                return response;
            }, "Failed to get lecturer selection");
        }

        public async Task<Result<PaginatedResult<GetLecturerResponseDto>>> GetAllLecturerWithClassAsync(GetLecturerRequestDto requestDto)
        {
            var pageNumber = requestDto.PaginatedRequest.PageNumber;
            var pageSize = requestDto.PaginatedRequest.PageSize;
            var searchTerm = requestDto.SearchTerm;
            var orderBy = requestDto.PaginatedRequest.OrderBy;
            var isAscending = requestDto.PaginatedRequest.IsAscending;
            return await ExecuteAsync(async () =>
            {
                if (!_validateService.HasAdminPermissionAsync())
                    throw new UnauthorizedAccessException("You don't have permission to perform this action");

                var lecturers = await _userRepository.GetAllLecturerAsync(pageNumber, pageSize, searchTerm, orderBy, isAscending);
                if (lecturers.Count == 0)
                    return new PaginatedResult<GetLecturerResponseDto>([], 0, pageNumber, pageSize);
                
                var courses = await _courseRepository.GetCoursesByMultipleLecturerIdAsync(
                    lecturers.Select(lecturer => lecturer.LecturerId ?? string.Empty)
                        .ToList());
                var response = lecturers.Select(lecturer => new GetLecturerResponseDto
                {
                    UserId = lecturer.UserId,
                    LecturerId = lecturer.LecturerId ?? string.Empty,
                    Name = lecturer.UserName ?? string.Empty, 
                    Email = lecturer.Email ?? string.Empty,
                    ProgrammeName = lecturer.Programme != null 
                        ? lecturer.Programme.ProgrammeName ?? string.Empty 
                        : string.Empty,
                    RegisteredCourses = courses.Where(c => c.LecturerId == lecturer.LecturerId)
                        .Select(course => new LecturerCourseViewResponseDto
                        {
                            CourseId = course.CourseId,
                            CourseCode = course.CourseCode,
                            CourseName = course.CourseName,
                            CourseSession = course.CourseSession,
                            Status = course.Semester.EndWeek <= DateOnly.FromDateTime(DateTime.Now) ? "Archived" : "Active",
                            EnrolledStudentsCount = course.EnrolledStudents.Count,
                        }).ToList(),
                }).ToList();
                
                var paginatedResult = new PaginatedResult<GetLecturerResponseDto>(
                    response, 
                    await _userRepository.GetTotalLecturerAsync(searchTerm),
                    pageNumber, 
                    pageSize
                );
                return paginatedResult;
            }, 
            "Failed to get all lecturers with class");
        }

        public async Task<Result<PaginatedResult<GetStudentResponseDto>>> GetAllStudentWithClassAsync(GetStudentRequestDto requestDto)
        {
            var pageNumber = requestDto.PaginatedRequest.PageNumber;
            var pageSize = requestDto.PaginatedRequest.PageSize;
            var searchTerm = requestDto.SearchTerm;
            var orderBy = requestDto.PaginatedRequest.OrderBy;
            var isAscending = requestDto.PaginatedRequest.IsAscending;
            return await ExecuteAsync(async () =>
            {
                if (!_validateService.HasAdminPermissionAsync())
                    throw new UnauthorizedAccessException("You don't have permission to perform this action");

                var students = await _userRepository.GetAllStudentAsync(pageNumber, pageSize, searchTerm, orderBy, isAscending);
                if (students.Count == 0)
                    return new PaginatedResult<GetStudentResponseDto>(new List<GetStudentResponseDto>(), 0, pageNumber, pageSize);
                
                var studentIds = students.Select(student => student.StudentId ?? string.Empty).ToList();
                var courses = await _courseRepository.GetEnrollmentCoursesByMultipleStudentIdAsync(studentIds);
                var response = new List<GetStudentResponseDto>();
                foreach (var student in students)
                {
                    var enrolledCourses = new List<StudentCourseViewResponseDto>();
                    var studentCourses = courses.Where(c => c.EnrolledStudents
                        .Any(s => s.StudentId == student.StudentId));
                    
                    foreach (var course in studentCourses)
                    {
                        var tutorialId = course.EnrolledStudents
                            .Where(s => s.StudentId == student.StudentId)
                            .Select(s => s.TutorialId)
                            .FirstOrDefault();
                        
                        enrolledCourses.Add(new StudentCourseViewResponseDto
                        {
                            CourseId = course.CourseId,
                            CourseCode = course.CourseCode,
                            CourseName = course.CourseName,
                            LecturerName = await _userRepository.GetLecturerNameByLecturerIdAsync(course.LecturerId),
                            Status = course.Semester.EndWeek <= DateOnly.FromDateTime(DateTime.Now) ? "Archived" : "Active",
                            TutorialSession = await _courseRepository.GetTutorialNameByTutorialIdAsync(tutorialId)
                        });
                    }

                    var fingerprint = await _userRepository.GetFingerprintByStudentIdAsync(student.StudentId ?? string.Empty);

                    response.Add(new GetStudentResponseDto
                    {
                        UserId = student.UserId,
                        StudentId = student.StudentId ?? string.Empty,
                        Name = student.UserName ?? string.Empty,
                        Email = student.Email ?? string.Empty,
                        ProgrammeName = student.Programme != null 
                            ? student.Programme.ProgrammeName ?? string.Empty 
                            : string.Empty,
                        EnrolledCourses = enrolledCourses,
                        HasDevice = fingerprint.BindDate != DateOnly.MinValue ? true : false,
                        DeviceBindDate = fingerprint.BindDate != DateOnly.MinValue ? fingerprint.BindDate : DateOnly.MinValue
                    });
                }

                return new PaginatedResult<GetStudentResponseDto>(
                    response,
                    await _userRepository.GetTotalStudentAsync(searchTerm),
                    pageNumber,
                    pageSize
                );
            },
            "Failed to get all students with class");
        }
    
        public async Task<Result<bool>> CreateNewUserAsync(CreateAccountRequestDto requestDto) 
        {
            return await ExecuteAsync(async () =>
            {
                if (!_validateService.HasAdminPermissionAsync())
                    throw new UnauthorizedAccessException("You don't have permission to perform this action");

                if (requestDto.Role == AccRoleEnum.Student && !_validateService.HasStudentIdMatchEmail(requestDto.CampusId, requestDto.Email))
                    throw new InvalidOperationException("The student ID does not match with the email");

                if (!await _validateService.HasProgrammeAsync(requestDto.ProgrammeId))
                    throw new KeyNotFoundException("Programme not found");

                if (await _validateService.ValidateEmailAsync(requestDto.Email))
                    throw new InvalidOperationException("The email has been used");
                
                if (requestDto.Role == AccRoleEnum.Lecturer && await _validateService.ValidateLecturerAsync(requestDto.CampusId))
                    throw new InvalidOperationException("The lecturer ID has been used");

                if (requestDto.Role == AccRoleEnum.Student && await _validateService.ValidateStudentAsync(requestDto.CampusId))
                    throw new InvalidOperationException("The student ID has been used");

                var newUser = new UserDetail
                {
                    StudentId = requestDto.Role == AccRoleEnum.Student ? requestDto.CampusId : null, 
                    LecturerId = requestDto.Role != AccRoleEnum.Student ? requestDto.CampusId : null, 
                    ProgrammeId = requestDto.ProgrammeId,
                    UserName = FormatName(requestDto.Name),
                    Email = requestDto.Email,
                    UserPassword = BCrypt.Net.BCrypt.HashPassword(requestDto.CampusId.ToLower()),
                    AccRole = requestDto.Role.ToString(),
                    IsDeleted = false
                };
                await _userRepository.CreateUserAsync(newUser);
                return true;
            },
            $"Failed to create new account");
        }
        
        public async Task<Result<bool>> EditUserAsync(EditProfileRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                if (!_validateService.HasAdminPermissionAsync())
                    throw new UnauthorizedAccessException("You don't have permission to perform this action");

                if (requestDto.Role == AccRoleEnum.Student && !_validateService.HasStudentIdMatchEmail(requestDto.CampusId, requestDto.Email))
                    throw new InvalidOperationException("The student ID does not match with the email");

                if (!await _validateService.ValidateUserAsync(requestDto.UserId))
                    throw new KeyNotFoundException("User not found");
                
                if (!await _validateService.ValidateEmailWithUserIdAsync(requestDto.Email, requestDto.UserId))
                {
                    // if the email is changed, check if the new email has been used
                    if (await _validateService.ValidateEmailAsync(requestDto.Email))
                        throw new InvalidOperationException("The email has been used");
                }

                if (requestDto.Role == AccRoleEnum.Student && !await _validateService.ValidateStudentIdWithUserIdAsync(requestDto.CampusId, requestDto.UserId))
                {
                    // if the stduent id is changed, check if the new student id has been used
                    if (await _validateService.ValidateStudentAsync(requestDto.CampusId))
                        throw new InvalidOperationException("The student ID has been used");
                }

                var user = new UserDetail
                {
                    UserId = requestDto.UserId,
                    StudentId = requestDto.Role == AccRoleEnum.Student ? requestDto.CampusId : null,
                    UserName = FormatName(requestDto.Name),
                    Email = requestDto.Email,
                };
                await _userRepository.EditUserAsync(user);
                return true;
            },
            $"Failed to edit user");
        }
        
        public async Task<Result<bool>> DeleteUserAsync(DeleteRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                if (!_validateService.HasAdminPermissionAsync())
                    throw new UnauthorizedAccessException("You don't have permission to perform this action");
                if (!await _validateService.ValidateUserAsync(requestDto.Id))
                    throw new KeyNotFoundException("User not found");

                await _userRepository.DeleteUserAsync(requestDto.Id);
                return true;
            },
            $"Failed to delete user with ID {requestDto.Id}");
        }

        public async Task<Result<bool>> MultipleDeleteUserAsync(List<DeleteRequestDto> requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                if (!_validateService.HasAdminPermissionAsync())
                    throw new UnauthorizedAccessException("You don't have permission to perform this action");

                var userIds = requestDto.Select(r => r.Id).ToList();
                if (userIds.Count == 0)
                    throw new InvalidOperationException("No user IDs provided");
                if (userIds.Any(id => id <= 0))
                    throw new InvalidOperationException("Invalid user ID found");
                
                await _userRepository.MultipleDeleteUserAsync(userIds);
                return true;
            },
            $"Failed to delete users");
        }

        public async Task<Result<bool>> ResetPasswordAsync(DataIdRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                if (!_validateService.HasAdminPermissionAsync())
                    throw new UnauthorizedAccessException("You don't have permission to perform this action");
                if (!await _validateService.ValidateUserAsync(requestDto.IdInInteger ?? 0))
                    throw new KeyNotFoundException("User not found");
                if (string.IsNullOrEmpty(requestDto.IdInString))
                    throw new InvalidOperationException("Invalid new password");
                
                // campus id (lower case) as the new password
                var newPassword = BCrypt.Net.BCrypt.HashPassword(requestDto.IdInString.ToLower());
                return await _userRepository.ChangeUserPasswordAsync(requestDto.IdInInteger ?? 0, newPassword);
            },
            $"Failed to reset password for the user");
        }

        public async Task<Result<bool>> ResetFingerprintOfStudentAsync(DataIdRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                if (!_validateService.HasAdminPermissionAsync())
                    throw new UnauthorizedAccessException("You don't have permission to perform this action");
                if (!await _validateService.ValidateStudentAsync(requestDto.IdInString ?? string.Empty))
                    throw new KeyNotFoundException("Student not found");
                return await _userRepository.ResetFingerprintOfStudentAsync(requestDto.IdInString ?? string.Empty);
            },
            $"Failed to reset device binding");
        }

        public async Task<Result<bool>> MultipleResetFingerprintOfStudentAsync(List<DataIdRequestDto> requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                if (!_validateService.HasAdminPermissionAsync())
                    throw new UnauthorizedAccessException("You don't have permission to perform this action");

                //var userIds = requestDto.Select(r => r.IdInInteger).ToList();
                var userIds = requestDto
                    .Select(r => r.IdInInteger)
                    .Where(id => id.HasValue) // 过滤掉 null 值
                    .Select(id => id.Value) // 转换为 int
                    .ToList();
                    
                if (userIds.Count == 0)
                    throw new InvalidOperationException("No user IDs provided");
                if (userIds.Any(id => id <= 0))
                    throw new InvalidOperationException("Invalid user ID found");
                return await _userRepository.MultipleResetFingerprintOfStudentAsync(userIds);
            },
            $"Failed to unbind devices of students");
        }
        public async Task<Result<bool>> CreateSingleStudentAccountAsync(CreateAccountRequestDto requestDto)
        {
            return await ExecuteAsync(
                async () =>
                {
                    var newStudentAccount = new UserDetail
                    {
                        StudentId = requestDto.CampusId,
                        UserName = requestDto.Name,
                        Email = requestDto.Email,
                        UserPassword = BCrypt.Net.BCrypt.HashPassword(requestDto.Password),
                        AccRole = AccRoleEnum.Student.ToString(),
                        ProgrammeId = requestDto.ProgrammeId,
                        IsDeleted = false
                    };
                    return await _userRepository.CreateUserAsync(newStudentAccount);
                },
                "Failed to create student account"
            );
        }
        
        public async Task<Result<bool>> CreateMultipleStudentAccountsAsync(List<CreateAccountRequestDto> requestDto, int programmeId)
        {
            return await ExecuteAsync(
                async () =>
                {
                    var existedStudentIds = await _userRepository.GetAllExistedStudentIdinProgrammeAsync(programmeId);
                    
                    var newStudents = requestDto.Where(student => !existedStudentIds.Contains(student.CampusId))
                        .ToList();
                    var accountToBeCreate = newStudents.Select(student => new UserDetail
                    {
                        StudentId = student.CampusId,
                        UserName = student.Name,
                        Email = student.Email,
                        UserPassword = BCrypt.Net.BCrypt.HashPassword(student.Password),
                        AccRole = AccRoleEnum.Student.ToString(),
                        ProgrammeId = programmeId,
                        IsDeleted = false
                    }).ToList();

                    return await _userRepository.CreateMultipleUserAsync(accountToBeCreate);
                },
                "Failed to create student account"
            );
        }
    }
}