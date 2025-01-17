using attendance1.Application.Common.Enum;
using attendance1.Application.Common.Logging;
using attendance1.Application.Common.Response;
using attendance1.Application.DTOs.Common;
using attendance1.Application.DTOs.Lecturer;
using attendance1.Application.Interfaces;
using attendance1.Domain.Entities;
using attendance1.Domain.Interfaces;
using Microsoft.Extensions.Logging;
using System.Net;

namespace attendance1.Application.Services
{
    public class LectureService : BaseService, ILectureService
    {
        private readonly IValidateService _validateService;
        private readonly IUserService _userService;
        private readonly IUserRepository _userRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly IAttendanceRepository _attendanceRepository;

        public LectureService(ILogger<LectureService> logger, IValidateService validateService, IUserService userService, IUserRepository userRepository, ICourseRepository courseRepository, IAttendanceRepository attendanceRepository, LogContext logContext) 
            : base(logger, logContext)
        {
            _validateService = validateService ?? throw new ArgumentNullException(nameof(validateService));
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _courseRepository = courseRepository ?? throw new ArgumentNullException(nameof(courseRepository));
            _attendanceRepository = attendanceRepository ?? throw new ArgumentNullException(nameof(attendanceRepository));
        }

        #region private methods
        private string GenerateRandomAttendanceCode()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        private async Task<(List<string>, List<string>)> HandleStudentListAsync(byte[] studentList)
        {
            var studentIdList = new List<string>();
            var studentNameList = new List<string>();
            using var stream = new MemoryStream(studentList);
            using var reader = new StreamReader(stream);
            
            // 跳过 CSV 文件的第一行标题
            var isFirstLine = true;
            while (!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync();
                
                if (isFirstLine)
                {
                    isFirstLine = false;
                    continue; // 跳过标题行
                }

                var values = line.Split(','); // 假设 CSV 用逗号分隔
                if (values.Length >= 2) // 确保至少有两列数据
                {
                    studentIdList.Add(values[0]);
                    studentNameList.Add(values[1]);
                }
            }
            return (studentIdList, studentNameList);
        }

        private List<ClassWeekModel> GetClassWeekOfClass(CourseSemester semester, string classDay, List<DateOnly> attendanceDates)
        {
            var classDays = classDay.Split(',')
                                   .Select(day => int.Parse(day))
                                   .ToList();

            var weeks = new List<ClassWeekModel>();
            var currentDate = semester.StartWeek;
            
            // 找到第一个星期一
            while (currentDate.DayOfWeek != DayOfWeek.Monday)
            {
                currentDate = currentDate.AddDays(1);
            }

            var weekIndex = 1;
            while (currentDate <= semester.EndWeek)
            {
                var weekModel = new ClassWeekModel 
                { 
                    WeekIndex = weekIndex,
                    ClassDaysInThisWeek = new List<DateOnly>()
                };

                var weekStart = currentDate;
                var weekEnd = currentDate.AddDays(6);

                // 获取这周的常规课程日期
                for (int i = 0; i < 7; i++)
                {
                    var dayNumber = ((int)currentDate.DayOfWeek == 0) ? 7 : (int)currentDate.DayOfWeek;
                    if (classDays.Contains(dayNumber) && currentDate >= semester.StartWeek && currentDate <= semester.EndWeek)
                    {
                        weekModel.ClassDaysInThisWeek.Add(currentDate);
                    }
                    currentDate = currentDate.AddDays(1);
                }

                // 添加这周的考勤日期
                var attendanceDatesThisWeek = attendanceDates
                    .Where(d => d >= weekStart && 
                               d <= weekEnd)
                    .ToList();

                // 合并并去重
                weekModel.ClassDaysInThisWeek = weekModel.ClassDaysInThisWeek
                    .Union(attendanceDatesThisWeek)
                    .OrderBy(d => d)
                    .ToList();

                if (weekModel.ClassDaysInThisWeek.Any())
                {
                    weeks.Add(weekModel);
                }
                weekIndex++;
            }

            return weeks;
        }
        #endregion
        

        #region class CRUD
        public async Task<Result<GetClassDetailsResponseDto>> GetClassDetailsAsync(DataIdRequestDto requestDto)
        {
            if (!await _validateService.ValidateCourseAsync(requestDto.IdInInteger ?? 0))
                return Result<GetClassDetailsResponseDto>.FailureResult($"This class does not exist.", HttpStatusCode.NotFound);

            return await ExecuteAsync(
                async () =>
                {
                    var classDetails = await _courseRepository.GetCourseDetailsAsync(requestDto.IdInInteger ?? 0);
                    return new GetClassDetailsResponseDto 
                    {
                        CourseId = classDetails.CourseId,
                        CourseCode = classDetails.CourseCode,
                        CourseName = classDetails.CourseName,
                        CourseSession = classDetails.CourseSession,
                        ClassDay = classDetails.ClassDay ?? string.Empty,
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
                        }
                    };
                },
                $"Error occurred while getting the class details"
            );
        }
        
        public async Task<Result<DataIdResponseDto>> CreateNewClassAsync(CreateClassRequestDto requestDto)
        {
            if (!await _validateService.ValidateLecturerAsync(requestDto.LecturerId))
                return Result<DataIdResponseDto>.FailureResult($"Lecturer with ID {requestDto.LecturerId} does not exist.", HttpStatusCode.NotFound);

            return await ExecuteAsync(
                async () =>
                {
                    // process course
                    var course = new Course
                    {
                        LecturerId = requestDto.LecturerId,
                        CourseCode = requestDto.ClassCode,
                        CourseName = requestDto.ClassName,
                        CourseSession = requestDto.ClassSession,
                        ClassDay = requestDto.LectureClassDay,
                        ProgrammeId = requestDto.ProgrammeId,
                        IsDeleted = false
                    };

                    // process semester
                    var semester = new CourseSemester
                    {
                        StartWeek = requestDto.Semester.StartDate,
                        EndWeek = requestDto.Semester.EndDate   
                    };

                    // process tutorial
                    var tutorials = new List<Tutorial>();
                    foreach (var tutorial in requestDto.Tutorials)
                    {
                        tutorials.Add(new Tutorial
                        {
                            TutorialName = tutorial.TutorialName,
                            TutorialClassDay = tutorial.TutorialClassDay,
                            LectureId = requestDto.LecturerId,
                            IsDeleted = false
                        });
                    }

                    // process studen: create student accounts
                    var (studentIdList, studentNameList) = await HandleStudentListAsync(requestDto.StudentList);
                    var studentAccounts = studentIdList.Select(studentId => new CreateAccountRequestDto
                    {
                        CampusId = studentId,
                        Name = studentNameList[studentIdList.IndexOf(studentId)],
                        Email = $"{studentId}@student.uts.edu.my",
                        Password = studentId.ToLower(),
                        Role = AccRoleEnum.Student
                    }).ToList();
                    var createAccountTask = await _userService.CreateMultipleStudentAccountsAsync(studentAccounts);
                    if (!createAccountTask.Success)
                        throw new Exception("Failed to create students' accounts.");

                    // process student: add students to course
                    var students = studentIdList.Select(studentId => new EnrolledStudent 
                    { 
                        StudentId = studentId,
                        StudentName = studentNameList[studentIdList.IndexOf(studentId)],
                        IsDeleted = false,
                    }).ToList();
                    
                    var courseId = await _courseRepository.CreateNewCourseAsync(course, semester, tutorials, students);
                    if (courseId <= 0)
                    {
                        throw new Exception("Failed to create a new course.");
                    }

                    return new DataIdResponseDto 
                    {   
                        Id = courseId,
                        Name = course.CourseName
                    };
                },
                $"Error occurred while creating a new class for lecturer {requestDto.LecturerId}"
            );
        }

        public async Task<Result<bool>> EditClassAsync(EditClassRequestDto requestDto)
        {
            if (!await _validateService.ValidateCourseAsync(requestDto.ClassId))
                return Result<bool>.FailureResult($"This class does not exist.", HttpStatusCode.NotFound);

            return await ExecuteAsync(
                async () =>
                {
                    var course = new Course
                    {
                        CourseId = requestDto.ClassId,
                        CourseCode = requestDto.ClassCode,
                        CourseName = requestDto.ClassName,
                        CourseSession = requestDto.ClassSession,
                        ClassDay = requestDto.LectureClassDay,
                        ProgrammeId = requestDto.ProgrammeId,
                    };

                    var semester = new CourseSemester
                    {
                        SemesterId = requestDto.Semester.SemesterId,
                        StartWeek = requestDto.Semester.StartWeek,
                        EndWeek = requestDto.Semester.EndWeek
                    };

                    return await _courseRepository.EditCourseAsync(course, semester);
                },
                $"Error occurred while editing class {requestDto.ClassId}"
            );
        }

        public async Task<Result<bool>> DeleteClassAsync(DeleteRequestDto requestDto)
        {
            if (!await _validateService.ValidateCourseAsync(requestDto.Id))
                return Result<bool>.FailureResult($"This class does not exist.", HttpStatusCode.NotFound);

            return await ExecuteAsync(
                async () =>
                {
                    return await _courseRepository.DeleteCourseAsync(requestDto.Id);
                },
                $"Error occurred while deleting this class"
            );
        }

        public async Task<Result<List<GetLecturerClassRequestDto>>> GetClassesOfLecturerAsync(DataIdRequestDto requestDto)
        {
            if (string.IsNullOrEmpty(requestDto.IdInString))
                return Result<List<GetLecturerClassRequestDto>>.FailureResult($"Lecturer ID is required.", HttpStatusCode.BadRequest);

            if (!await _validateService.ValidateLecturerAsync(requestDto.IdInString))
                return Result<List<GetLecturerClassRequestDto>>.FailureResult($"Lecturer with ID {requestDto.IdInString} does not exist.", HttpStatusCode.NotFound);

            return await ExecuteAsync(
                async () =>
                {
                    var courses = await _courseRepository.GetCoursesByLecturerIdAsync(requestDto.IdInString);
                    return courses.Select(c => new GetLecturerClassRequestDto
                    {
                        LecturerId = c.LecturerId,
                        ClassId = c.CourseId,
                        ClassCode = c.CourseCode,
                        ClassName = c.CourseName,
                        ClassSession = c.CourseSession,
                        OnClassDay = c.ClassDay ?? string.Empty
                    }).ToList();
                },
                $"Error occurred while getting the classes of lecturer {requestDto.IdInString}"
            );
        }

        public async Task<Result<GetClassDetailsWithAttendanceDataResponseDto>> GetClassDetailsWithAttendanceDataAsync(DataIdRequestDto requestDto)
        {
            if (!await _validateService.ValidateCourseAsync(requestDto.IdInInteger ?? 0))
                return Result<GetClassDetailsWithAttendanceDataResponseDto>.FailureResult($"This class does not exist.", HttpStatusCode.NotFound);

            return await ExecuteAsync(
                async () =>
                {
                    var courseId = requestDto.IdInInteger ?? 0;
                    var course = await _courseRepository.GetCourseDetailsWithStudentsAndTutorialsAsync(courseId);
                    var attendanceData = await _attendanceRepository.GetAttendanceDataByCourseIdAsync(courseId);
                    var lectureAttendanceDates = attendanceData.Where(a => a.Record.IsLecture == true)
                        .Select(a => DateOnly.FromDateTime(a.DateAndTime))
                        .ToList();
                    var tutorialAttendanceDates = attendanceData.Where(a => a.Record.IsLecture == false)
                        .Select(a => DateOnly.FromDateTime(a.DateAndTime))
                        .ToList();

                    return new GetClassDetailsWithAttendanceDataResponseDto
                    {
                        CourseId = course.CourseId,
                        CourseCode = course.CourseCode,
                        CourseName = course.CourseName,
                        CourseSession = course.CourseSession,
                        ClassDay = course.ClassDay ?? string.Empty,
                        ProgrammeName = course.Programme.ProgrammeName,
                        LectureWeekOfClass = GetClassWeekOfClass(course.Semester, course.ClassDay, lectureAttendanceDates),
                        EnrolledStudentsWithAttendance = course.EnrolledStudents
                            .Where(s => s.CourseId == course.CourseId && s.IsDeleted == false)
                            .Select(s => new GetStudentWithAttendanceDataResponseDto
                            {
                                StudentId = s.StudentId,
                                StudentName = s.StudentName,
                                AttendanceData = attendanceData
                                    .Where(a => a.CourseId == course.CourseId
                                        && a.StudentId == s.StudentId 
                                        && a.Record.IsLecture == true)
                                    .Select(a => new GetAttendanceDataResponseDto
                                    {
                                        AttendanceCodeId = a.RecordId,
                                        Remark = a.Remark ?? string.Empty,
                                        AttendanceId = a.AttendanceId,
                                        DateAndTime = a.DateAndTime,
                                        IsLecture = a.Record.IsLecture,
                                        IsPresent = a.IsPresent
                                    }).ToList()
                            }).ToList(),
                        Tutorials = course.Tutorials.Select(t => new GetTutorialDetailsResponseDto
                        {
                            TutorialId = t.TutorialId,
                            TutorialName = t.TutorialName ?? string.Empty,
                            TutorialClassDay = t.TutorialClassDay ?? string.Empty,
                            TutorialWeekOfClass = GetClassWeekOfClass(course.Semester, t.TutorialClassDay, tutorialAttendanceDates),
                            EnrolledStudentsWithAttendance = t.EnrolledStudents
                                .Where(s => s.TutorialId == t.TutorialId && t.IsDeleted == false && s.IsDeleted == false)
                                .Select(s => new GetStudentWithAttendanceDataResponseDto
                                {
                                    StudentId = s.StudentId,
                                    StudentName = s.StudentName,
                                    AttendanceData = attendanceData
                                        .Where(a => a.CourseId == course.CourseId
                                            && a.StudentId == s.StudentId 
                                            && a.Record.IsLecture == false)
                                        .Select(a => new GetAttendanceDataResponseDto
                                        {
                                            AttendanceCodeId = a.RecordId,
                                            Remark = a.Remark ?? string.Empty,
                                            AttendanceId = a.AttendanceId,
                                            DateAndTime = a.DateAndTime,
                                            IsLecture = a.Record.IsLecture,
                                            IsPresent = a.IsPresent
                                        }).ToList()
                                }).ToList()
                        }).ToList(),
                        
                    };
                },
                $"Error occurred while getting the classes details"
            );
        }
        #endregion

        #region student CRUD
        public async Task<Result<bool>> AddStudentToClassAsync(AddStudentToClassRequestDto requestDto)
        {
            if (!await _validateService.ValidateCourseAsync(requestDto.CourseId))
                throw new KeyNotFoundException($"Course not found.");

            return await ExecuteAsync(
                async () =>
                {
                    var students = new List<EnrolledStudent>();
                    if (!string.IsNullOrEmpty(requestDto.StudentId) && !string.IsNullOrEmpty(requestDto.StudentName))
                    {
                        // single student
                        students.Add(new EnrolledStudent
                        {
                            CourseId = requestDto.CourseId,
                            StudentId = requestDto.StudentId,
                            StudentName = requestDto.StudentName,
                            IsDeleted = false
                        });
                    }
                    else
                    {
                        // multiple students
                        var (studentIdList, studentNameList) = await HandleStudentListAsync(requestDto.StudentList);
                        if (studentIdList.Count != studentNameList.Count)
                            throw new ArgumentException("Mismatch between student ID list and student name list.");

                        students = studentIdList
                            .Select((studentId, index) => new EnrolledStudent 
                            { 
                                CourseId = requestDto.CourseId,
                                StudentId = studentId,
                                StudentName = studentNameList[index],
                                IsDeleted = false,
                            }).ToList();
                    }

                    return await _courseRepository.AddStudentToClassAsync(requestDto.CourseId, students);
                },
                $"Error occurred while adding student to class {requestDto.CourseId}"
            );
        }

        public async Task<Result<bool>> AddStudentToTutorialAsync(AddStudentToTutorialRequestDto requestDto)
        {
            if (!await _validateService.ValidateCourseAsync(requestDto.CourseId))
                return Result<bool>.FailureResult($"Course with ID {requestDto.CourseId} does not exist.", HttpStatusCode.NotFound);

            if (!await _validateService.ValidateTutorialAsync(requestDto.TutorialId, requestDto.CourseId))
                return Result<bool>.FailureResult($"Tutorial with ID {requestDto.TutorialId} does not exist.", HttpStatusCode.NotFound);

            return await ExecuteAsync(
                async () =>
                {
                    var hasAdded = await _courseRepository.AddStudentToTutorialAsync(requestDto.TutorialId, requestDto.CourseId, requestDto.StudentIdList);
                    return hasAdded;
                },
                $"Error occurred while adding student to tutorial {requestDto.TutorialId}"
            );
        }

        public async Task<Result<bool>> RemoveStudentFromClassAsync(RemoveStudentFromClassRequestDto requestDto)
        {
            if (!await _validateService.ValidateCourseAsync(requestDto.CourseId))
                return Result<bool>.FailureResult($"Course with ID {requestDto.CourseId} does not exist.", HttpStatusCode.NotFound);

            return await ExecuteAsync(
                async () =>
                {
                    return await _courseRepository.RemoveStudentFromClassAsync(requestDto.CourseId, requestDto.StudentIdList);
                },
                $"Error occurred while removing student from class {requestDto.CourseId}"
            );
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
        #endregion
        
        #region attendance CRUD
        public async Task<Result<GetAttendanceCodeResponseDto>> GenerateAttendanceCodeAsync(CreateAttendanceCodeRequestDto requestDto)
        {
            if (!await _validateService.ValidateCourseAsync(requestDto.CourseId))
                return Result<GetAttendanceCodeResponseDto>.FailureResult($"This class does not exist.", HttpStatusCode.NotFound);

            return await ExecuteAsync(
                async () =>
                {
                    var code = new AttendanceRecord
                    {
                        AttendanceCode = GenerateRandomAttendanceCode(),
                        Date = DateOnly.FromDateTime(DateTime.Now),
                        StartTime = TimeOnly.FromDateTime(DateTime.Now),
                        EndTime = TimeOnly.FromDateTime(DateTime.Now.AddSeconds(requestDto.DurationInSeconds)),
                        CourseId = requestDto.CourseId,
                        IsLecture = requestDto.IsLecture,
                        TutorialId = requestDto.TutorialId ?? 0
                    };
                    var saveSuccess = await _attendanceRepository.CreateAttendanceCodeAsync(code);
                    if (!saveSuccess)
                        throw new Exception("Failed to save the attendance code.");

                    return new GetAttendanceCodeResponseDto
                    {
                        AttendanceCode = code.AttendanceCode,
                        StartTime = code.StartTime ?? TimeOnly.MinValue,
                        EndTime = code.EndTime ?? TimeOnly.MinValue,
                    };
                },
                $"Error occurred while generating attendance code for the class"
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

        public async Task<Result<bool>> InsertAbsentStudentAttendanceAsync(CreateAbsentStudentAttendanceRequestDto requestDto)
        {
            if (!await _validateService.ValidateCourseAsync(requestDto.CourseId))
                return Result<bool>.FailureResult($"This class does not exist.", HttpStatusCode.NotFound);

            if (!await _validateService.ValidateAttendanceCodeAsync(requestDto.AttendanceCodeId))
                return Result<bool>.FailureResult($"This attendance code does not exist.", HttpStatusCode.NotFound);

            return await ExecuteAsync(
                async () =>
                {
                    return await _attendanceRepository.InsertAbsentStudentAttendanceAsync(requestDto.CourseId, requestDto.AttendanceCodeId);
                },
                $"Error occurred while inserting absent student attendance data"
            );
        }

        public async Task<Result<bool>> ChangeAttendanceDataOfStudentAsync(EditAttendanceDataRequestDto requestDto)
        {
            return await ExecuteAsync(
                async () =>
                {
                    var attendanceDataToChange = requestDto.AttendanceData
                        .Select(a => new StudentAttendance
                        {
                            AttendanceId = a.AttendanceId ?? 0,
                            RecordId = requestDto.AttendanceCodeId,
                            CourseId = requestDto.CourseId,
                            Remark = a.Remark,
                            IsPresent = a.IsPresent
                        }).ToList();
                    
                    return await _attendanceRepository.ChangeAttendanceDataAsync(attendanceDataToChange);
                },
                $"Error occurred while changing attendance data of the date {requestDto.AttendanceCodeId}"
            );
        }
        // public async Task<Result<bool>> ChangeAttendanceDataOfStudentAsync(EditAttendanceDataDto editAttendanceDataDto)
        // {
        //     return await ExecuteAsync(
        //         async () =>
        //         {
        //             var attendanceDataToInsert = editAttendanceDataDto.AttendanceData
        //                 .Where(a => a.IsPresent == true)
        //                 .Select(a => new StudentAttendance
        //                 {
        //                     CourseId = editAttendanceDataDto.CourseId,
        //                     StudentId = a.StudentId,
        //                     RecordId = editAttendanceDataDto.AttendanceCodeId,
        //                     DateAndTime = editAttendanceDataDto.DateAndTime,
        //                     Remark = a.Remark,
        //                 }).ToList();

        //             var attendanceDataToDelete = editAttendanceDataDto.AttendanceData
        //                 .Where(a => a.AttendanceId != null && a.AttendanceId > 0 && a.IsPresent == false)
        //                 .Select(a => a.AttendanceId ?? 0)
        //                 .ToList();

        //             var insertTask = attendanceDataToInsert.Any()
        //                 ? _attendanceRepository.InsertAttendanceDataOfStudentAsync(attendanceDataToInsert)
        //                 : Task.FromResult(true);

        //             var deleteTask = attendanceDataToDelete.Any()
        //                 ? _attendanceRepository.RemoveAttendanceDataOfStudentAsync(attendanceDataToDelete)
        //                 : Task.FromResult(true);

        //             var insertResult = await insertTask;
        //             var deleteResult = await deleteTask;

        //             return insertResult && deleteResult;
        //         },
        //         $"Error occurred while changing attendance data of the date {editAttendanceDataDto.AttendanceCodeId}"
        //     );
        // }
        #endregion

        #region tutorial CRUD
        public async Task<Result<bool>> CreateNewTutorialAsync(CreateTutorialRequestDto requestDto)
        {
            if (!await _validateService.ValidateCourseAsync(requestDto.CourseId))
                return Result<bool>.FailureResult($"The class does not exist.", HttpStatusCode.NotFound);

            if (!await _validateService.ValidateLecturerAsync(requestDto.LecturerId))
                return Result<bool>.FailureResult($"Lecturer with ID {requestDto.LecturerId} does not exist.", HttpStatusCode.NotFound);

            return await ExecuteAsync(
                async () =>
                {
                    var tutorial = new Tutorial
                    {
                        TutorialName = requestDto.TutorialName,
                        TutorialClassDay = requestDto.TutorialClassDay,
                        CourseId = requestDto.CourseId,
                        LectureId = requestDto.LecturerId,
                        IsDeleted = false
                    };
                    return await _courseRepository.CreateNewTutorialAsync(tutorial);
                },
                $"Error occurred while creating a new tutorial session for the class"
            );
        }
        
        public async Task<Result<bool>> EditTutorialAsync(EditTutorialRequestDto requestDto)
        {
           if (!await _validateService.ValidateCourseAsync(requestDto.CourseId))
                return Result<bool>.FailureResult($"The class does not exist.", HttpStatusCode.NotFound);

            if (!await _validateService.ValidateTutorialAsync(requestDto.TutorialId, requestDto.CourseId))
                return Result<bool>.FailureResult($"This tutorial session does not exist.", HttpStatusCode.NotFound);

            return await ExecuteAsync(
                async () =>
                {
                    var tutorial = new Tutorial
                    {
                        TutorialId = requestDto.TutorialId,
                        TutorialName = requestDto.TutorialName,
                        TutorialClassDay = requestDto.TutorialClassDay,
                    };
                    return await _courseRepository.EditTutorialAsync(tutorial);
                },
                $"Error occurred while editing this tutorial session"
            );
        }
       
        public async Task<Result<bool>> DeleteTutorialAsync(DeleteRequestDto requestDto)
        {
            if (!await _courseRepository.HasTutorialExistedAsync(requestDto.Id))
                return Result<bool>.FailureResult($"This tutorial session does not exist.", HttpStatusCode.NotFound);

            return await ExecuteAsync(
                async () =>
                {
                    return await _courseRepository.DeleteTutorialAsync(requestDto.Id);
                },
                $"Error occurred while deleting this tutorial session"
            );
        }
        #endregion
    }
}


