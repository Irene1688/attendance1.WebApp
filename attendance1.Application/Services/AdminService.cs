using attendance1.Application.Common.Enum;
using attendance1.Application.Common.Logging;
using attendance1.Application.Common.Response;
using attendance1.Application.DTOs.Admin;
using attendance1.Application.DTOs.Common;
using attendance1.Application.Interfaces;
using attendance1.Domain.Entities;
using attendance1.Domain.Interfaces;
using Microsoft.Extensions.Logging;
using System.Globalization;
using System.Text.RegularExpressions;

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

        #region programme CRUD
        public async Task<Result<bool>> CreateNewProgrammeAsync(CreateProgrammeRequestDto requestDto) 
        {
            return await ExecuteAsync(async () =>
            {
                var isExisted = await _validateService.HasProgrammeNameExistedAsync(requestDto.ProgrammeName);
                if (isExisted)
                    throw new InvalidOperationException("The programme name has been used");

                var programme = new Programme
                {
                    ProgrammeName = FormatName(requestDto.ProgrammeName),
                    IsDeleted = false,
                };

                await _programmeRepository.CreateNewProgrammeAsync(programme);
                return true;
            },
            $"Failed to create new programme");
        }
        
        public async Task<Result<PaginatedResult<GetProgrammeResponseDto>>> GetAllProgrammeAsync(GetProgrammeRequestDto requestDto)
        {
            var pageNumber = requestDto.PaginatedRequest.PageNumber;
            var pageSize = requestDto.PaginatedRequest.PageSize;
            var searchTerm = requestDto.SearchTerm;
            var orderBy = requestDto.PaginatedRequest.OrderBy;
            var isAscending = requestDto.PaginatedRequest.IsAscending;
            return await ExecuteAsync(async () =>
            {
                var programmes = await _programmeRepository.GetAllProgrammeAsync(pageNumber, pageSize, searchTerm, orderBy, isAscending);
                var response = programmes.Select(programme => new GetProgrammeResponseDto
                {
                    ProgrammeId = programme.ProgrammeId,
                    ProgrammeName = programme.ProgrammeName, 
                }).ToList();
                
                var paginatedResult = new PaginatedResult<GetProgrammeResponseDto>(
                    response, 
                    programmes.Count(),
                    pageNumber, 
                    pageSize
                );
                return paginatedResult;
            }, 
            "Failed to get all programmes");
        }

        public async Task<Result<bool>> EditProgrammeAsync(EditProgrammeRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                if (!await _validateService.HasProgrammeAsync(requestDto.ProgrammeId))
                    throw new KeyNotFoundException("Programme not found");

                if (await _validateService.HasProgrammeNameExistedAsync(requestDto.ProgrammeName))
                    throw new InvalidOperationException("The programme name has been used");

                var programme = new Programme
                {
                    ProgrammeId = requestDto.ProgrammeId,
                    ProgrammeName = FormatName(requestDto.ProgrammeName),
                };
                await _programmeRepository.EditProgrammeAsync(programme);
                return true;
            },
            $"Failed to edit programme");

        }
        
        public async Task<Result<bool>> DeleteProgrammeAsync(DeleteRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                if (!await _validateService.HasProgrammeAsync(requestDto.Id))
                    throw new KeyNotFoundException("Programme not found");

                await _programmeRepository.DeleteProgrammeAsync(requestDto.Id);
                return true;
            },
            $"Failed to delete programme with ID {requestDto.Id}");
        }
        #endregion

        #region User CRUD
        public async Task<Result<bool>> CreateNewUserAsync(CreateAccountRequestDto requestDto) 
        {
            return await ExecuteAsync(async () =>
            {
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
                if (!await _validateService.ValidateUserAsync(requestDto.UserId))
                    throw new KeyNotFoundException("User not found");
                
                if (!await _validateService.ValidateEmailWithUserIdAsync(requestDto.Email, requestDto.UserId))
                {
                    if (await _validateService.ValidateEmailAsync(requestDto.Email))
                        throw new InvalidOperationException("The email has been used");
                }

                if (requestDto.Role == AccRoleEnum.Student && await _validateService.ValidateStudentAsync(requestDto.CampusId))
                    throw new InvalidOperationException("The student ID has been used");

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
            $"Failed to edit user: {requestDto.Name}");
        }
        
        public async Task<Result<bool>> DeleteUserAsync(DeleteRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                if (!await _validateService.ValidateUserAsync(requestDto.Id))
                    throw new KeyNotFoundException("User not found");

                await _userRepository.DeleteUserAsync(requestDto.Id);
                return true;
            },
            $"Failed to delete user with ID {requestDto.Id}");
        }

        public async Task<Result<bool>> ResetPasswordAsync(DataIdRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
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
        #endregion

        #region View Lecturer & Student
        public async Task<Result<PaginatedResult<GetLecturerResponseDto>>> GetAllLecturerWithClassAsync(GetLecturerRequestDto requestDto)
        {
            var pageNumber = requestDto.PaginatedRequest.PageNumber;
            var pageSize = requestDto.PaginatedRequest.PageSize;
            var searchTerm = requestDto.SearchTerm;
            var orderBy = requestDto.PaginatedRequest.OrderBy;
            var isAscending = requestDto.PaginatedRequest.IsAscending;
            return await ExecuteAsync(async () =>
            {
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
                    lecturers.Count(),
                    pageNumber, 
                    pageSize
                );
                return paginatedResult;
            }, 
            "Failed to get all lecturers with class");
        }

        public async Task<Result<PaginatedResult<GetStudentResponseDto>>> GetAllStudentWithClassAsync(PaginatedRequestDto requestDto)
        {
            var pageNumber = requestDto.PageNumber;
            var pageSize = requestDto.PageSize;
            return await ExecuteAsync(async () =>
            {
                var students = await _userRepository.GetAllStudentAsync(pageNumber, pageSize);
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

                    response.Add(new GetStudentResponseDto
                    {
                        UserId = student.UserId,
                        StudentId = student.StudentId ?? string.Empty,
                        Name = student.UserName ?? string.Empty,
                        Email = student.Email ?? string.Empty,
                        EnrolledCourses = enrolledCourses
                    });
                }

                return new PaginatedResult<GetStudentResponseDto>(
                    response,
                    students.Count,
                    pageNumber,
                    pageSize
                );
            },
            "Failed to get all students with class");
        }
        #endregion

        #region Class CRUD
        public async Task<Result<bool>> CreateNewCourseAsync(CreateCourseRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                var course = new Course 
                {
                    CourseCode = requestDto.CourseCode,
                    CourseName = requestDto.CourseName,
                    CourseSession = requestDto.CourseSession,
                    ClassDay = requestDto.ClassDay,
                    ProgrammeId = requestDto.ProgrammeId,
                    LecturerId = requestDto.LecturerId,
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
                    TutorialClassDay = t.ClassDay,
                    IsDeleted = false,
                }).ToList();

                var students = new List<EnrolledStudent>();
                await _courseRepository.CreateNewCourseAsync(course, semester, tutorials, students);
                return true;
            },
            $"Failed to create new course: {requestDto.CourseName}");
        }

        public async Task<Result<PaginatedResult<GetCourseResponseDto>>> GetAllCourseAsync(PaginatedRequestDto requestDto)
        {
            var pageNumber = requestDto.PageNumber;
            var pageSize = requestDto.PageSize;
            return await ExecuteAsync(async () =>
            {
                var courses = await _courseRepository.GetAllCourseAsync(pageNumber, pageSize);
                var processCoursesTask = courses.Select(async course => new GetCourseResponseDto
                {
                    CourseId = course.CourseId,
                    CourseCode = course.CourseCode,
                    CourseName = course.CourseName,
                    CourseSession = course.CourseSession,
                    ProgrammeName = course.Programme.ProgrammeName, 
                    LecturerId = course.LecturerId,
                    LecturerName = await _userRepository.GetLecturerNameByLecturerIdAsync(course.LecturerId),
                    ClassDay = course.ClassDay ?? string.Empty,
                    Status = course.Semester.EndWeek <= DateOnly.FromDateTime(DateTime.Now) ? "Archived" : "Active",
                    Tutorials = course.Tutorials.Select(t => new GetTutorialResponseDto
                    {
                        TutorialId = t.TutorialId,
                        TutorialName = t.TutorialName ?? string.Empty,
                        ClassDay = t.TutorialClassDay ?? string.Empty,
                    }).ToList(),
                }).ToList();

                var response = await Task.WhenAll(processCoursesTask);
                
                var paginatedResult = new PaginatedResult<GetCourseResponseDto>(
                    response.ToList(), 
                    courses.Count,
                    pageNumber, 
                    pageSize
                );
                return paginatedResult;
            }, 
            "Failed to get all courses");
        }

        public async Task<Result<bool>> EditCourseAsync(EditCourseRequestDto requestDto)
        {
            if (!await _validateService.ValidateCourseAsync(requestDto.CourseId))
                return Result<bool>.FailureResult($"Course with ID {requestDto.CourseId} does not exist");
            
            return await ExecuteAsync(async () =>
            {
                var course = new Course 
                {
                    CourseId = requestDto.CourseId,
                    CourseCode = requestDto.CourseCode,
                    CourseName = requestDto.CourseName,
                    CourseSession = requestDto.CourseSession,
                    ClassDay = requestDto.ClassDay,
                    ProgrammeId = requestDto.ProgrammeId,
                    LecturerId = requestDto.LecturerId,
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
                    TutorialClassDay = t.ClassDay,
                    IsDeleted = false,
                }).ToList();

                await _courseRepository.EditCourseWithTutorialsAsync(course, semester, tutorials);
                return true;
            },
            $"Failed to edit course: {requestDto.CourseName}");
        }

        public async Task<Result<bool>> DeleteCourseAsync(DeleteRequestDto requestDto)
        {
            if (!await _validateService.ValidateCourseAsync(requestDto.Id))
                return Result<bool>.FailureResult($"Course with ID {requestDto.Id} does not exist");
            
            return await ExecuteAsync(async () =>
            {
                await _courseRepository.DeleteCourseAsync(requestDto.Id);
                return true;
            },
            $"Failed to delete the course");

        }
        #endregion
    }
}