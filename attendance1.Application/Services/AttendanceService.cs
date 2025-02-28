using System;

namespace attendance1.Application.Services
{
    public class AttendanceService : BaseService, IAttendanceService
    {
        private readonly IAttendanceRepository _attendanceRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly IUserRepository _userRepository;
        private readonly IValidateService _validateService;

        public AttendanceService(ILogger<AttendanceService> logger, IValidateService validateService, IAttendanceRepository attendanceRepository, ICourseRepository courseRepository, IUserRepository userRepository, LogContext logContext)
            : base(logger, logContext)
        {
            _validateService = validateService ?? throw new ArgumentNullException(nameof(validateService));
            _attendanceRepository = attendanceRepository ?? throw new ArgumentNullException(nameof(attendanceRepository));
            _courseRepository = courseRepository ?? throw new ArgumentNullException(nameof(courseRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        }

        private string GenerateRandomAttendanceCode()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        // used in admin's page: class details
        public async Task<Result<PaginatedResult<GetAttendanceRecordByCourseIdResponseDto>>> GetAttendanceRecordByCourseIdAsync(GetAttendanceRecordByCourseIdRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                if (!await _validateService.HasPermissionToAccessCourseAsync(requestDto.CourseId))
                    throw new UnauthorizedAccessException("You are not permitted to access this class");

                var pageNumber = requestDto.PaginatedRequest.PageNumber;
                var pageSize = requestDto.PaginatedRequest.PageSize;
                var orderBy = requestDto.PaginatedRequest.OrderBy;
                var isAscending = requestDto.PaginatedRequest.IsAscending;

                var attendanceRecords = await _attendanceRepository.GetAttendanceRecordByCourseIdAsync(requestDto.CourseId);
                var studentAttendance = await _attendanceRepository.GetAttendanceDataByCourseIdAsync(requestDto.CourseId);

                var response = attendanceRecords.Select(ar => new GetAttendanceRecordByCourseIdResponseDto
                {
                    RecordId = ar.RecordId,
                    Date = ar.Date,
                    StartTime = ar.StartTime?.ToString("HH:mm:ss") ?? "00:00:00",
                    EndTime = ar.EndTime?.ToString("HH:mm:ss") ?? "00:00:00",
                    IsLecture = ar.IsLecture,
                    TutorialName = ar.Tutorial?.TutorialName ?? string.Empty,
                    PresentCount = studentAttendance
                        .Count(sa => sa.RecordId == ar.RecordId && sa.IsPresent == true),
                    AbsentCount = studentAttendance
                        .Count(sa => sa.RecordId == ar.RecordId && sa.IsPresent == false),
                    AttendanceRate = studentAttendance
                        .Where(sa => sa.RecordId == ar.RecordId)
                        .Any()
                        ? (double)studentAttendance
                            .Count(sa => sa.RecordId == ar.RecordId && sa.IsPresent == true) /
                          studentAttendance
                            .Count(sa => sa.RecordId == ar.RecordId)
                        : 0
                }).ToList();

                // sorting
                IOrderedEnumerable<GetAttendanceRecordByCourseIdResponseDto> sortedResponse;
                switch (orderBy)
                {
                    case "date":
                        sortedResponse = isAscending 
                            ? response.OrderBy(r => r.Date) 
                            : response.OrderByDescending(r => r.Date);
                        break;
                    case "presentcount":
                        sortedResponse = isAscending 
                            ? response.OrderBy(r => r.PresentCount) 
                            : response.OrderByDescending(r => r.PresentCount);
                        break;
                    case "absentcount":
                        sortedResponse = isAscending 
                            ? response.OrderBy(r => r.AbsentCount) 
                            : response.OrderByDescending(r => r.AbsentCount);
                        break;
                    case "attendancerate":
                        sortedResponse = isAscending 
                            ? response.OrderBy(r => r.AttendanceRate) 
                            : response.OrderByDescending(r => r.AttendanceRate);
                        break;
                    default:
                        sortedResponse = response.OrderByDescending(r => r.RecordId); // Default sorting
                        break;
                }

                // Paging
                var pagedResponse = sortedResponse.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();

                // Pagination
                var paginatedResult = new PaginatedResult<GetAttendanceRecordByCourseIdResponseDto>(
                    pagedResponse,
                    attendanceRecords.Count,
                    pageNumber,
                    pageSize
                );

                return paginatedResult;
            }, "Failed to get attendance record");
        }

        public async Task<Result<GetAttendanceCodeResponseDto>> GenerateAttendanceCodeAsync(CreateAttendanceCodeRequestDto requestDto)
        {
            return await ExecuteAsync(
                async () =>
                {
                    if (!await _validateService.HasPermissionToAccessCourseAsync(requestDto.CourseId))
                        throw new UnauthorizedAccessException("You are not permitted to access this class");

                    if (requestDto.TutorialId < 0 && !await _validateService.ValidateTutorialAsync(requestDto.TutorialId ?? 0, requestDto.CourseId))
                        throw new KeyNotFoundException("This tutorial does not exist.");

                    var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Kuala_Lumpur"); 
                    var localTime = TimeZoneInfo.ConvertTime(DateTime.Now, timeZone);

                    var code = new AttendanceRecord
                    {
                        AttendanceCode = GenerateRandomAttendanceCode(),
                        Date = DateOnly.FromDateTime(DateTime.Now),
                        StartTime = TimeOnly.FromDateTime(localTime),
                        EndTime = TimeOnly.FromDateTime(localTime.AddSeconds(requestDto.DurationInSeconds)),
                        CourseId = requestDto.CourseId,
                        IsLecture = requestDto.IsLecture,
                        TutorialId = requestDto.IsLecture ? null : requestDto.TutorialId,
                        IsDeleted = false
                    };
                    var saveSuccess = await _attendanceRepository.CreateAttendanceCodeAsync(code);
                    if (!saveSuccess)
                        throw new Exception("Failed to save the attendance code.");

                    return new GetAttendanceCodeResponseDto
                    {
                        CodeId = code.RecordId,
                        AttendanceCode = code.AttendanceCode,
                        StartTime = code.StartTime ?? TimeOnly.MinValue,
                        EndTime = code.EndTime ?? TimeOnly.MinValue,
                        TutorialId = code.TutorialId ?? 0
                    };
                },
                $"Error occurred while generating attendance code for the class"
            );
        }
    
        // lecturer's page: class attendance management
        public async Task<Result<GetStudentAttendanceDataByCourseIdResponseDto>> GetCourseStudentAttendanceRecordsAsync(DataIdRequestDto requestDto)
        {
            if (!await _validateService.HasPermissionToAccessCourseAsync(requestDto.IdInInteger ?? 0))
                throw new UnauthorizedAccessException("You are not permitted to access this class");

            return await ExecuteAsync(async () =>
            {
                // 获取课程信息和考勤记录
                var records = await _attendanceRepository.GetCourseStudentAttendanceRecordsAsync(requestDto.IdInInteger ?? 0);
                if (records == null || !records.Any())
                    records = new List<AttendanceRecord>();

                var attendances = await _attendanceRepository.GetAttendanceDataByCourseIdAsync(requestDto.IdInInteger ?? 0);
                if (attendances == null || !attendances.Any())
                    attendances = new List<StudentAttendance>();

                // 获取学生列表
                var students = await _courseRepository.GetEnrolledStudentsAsync(requestDto.IdInInteger ?? 0);
                if (students == null)
                    students = new List<EnrolledStudent>();

                // 获取教程组信息
                var tutorials = await _courseRepository.GetCourseTutorialsAsync(requestDto.IdInInteger ?? 0);

                // 构建响应
                var response = new GetStudentAttendanceDataByCourseIdResponseDto
                {
                    Records = records.Select(r => new AttendanceRecordDto
                    {
                        RecordId = r.RecordId,
                        Date = r.Date,
                        StartTime = r.StartTime?.ToString("HH:mm:ss") ?? "00:00:00",
                        EndTime = r.EndTime?.ToString("HH:mm:ss") ?? "00:00:00",
                        IsLecture = r.IsLecture,
                        TutorialId = r.TutorialId,
                        TutorialName = r.Tutorial?.TutorialName ?? string.Empty,
                        Attendances = attendances
                            .Where(a => a.RecordId == r.RecordId)
                            .Select(a => new StudentAttendanceStatusDto
                        {
                            StudentId = a.StudentId,
                            IsPresent = a.IsPresent
                        }).ToList()
                    }).ToList(),

                    Students = students.Select(s => new StudentAttendanceDto
                    {
                        StudentId = s.StudentId,
                        StudentName = s.StudentName,
                        TutorialId = s.TutorialId,
                        TutorialName = s.Tutorial?.TutorialName ?? string.Empty
                    }).ToList(),

                    Tutorials = tutorials.Select(t => new TutorialDto
                    {
                        TutorialId = t.TutorialId,
                        TutorialName = t.TutorialName ?? string.Empty
                    }).ToList(),

                    Total = students.Count
                };

                return response;
            }, "Failed to get class attendance records");
        }

        public async Task<Result<bool>> InsertAbsentStudentAttendanceAsync(CreateAbsentStudentAttendanceRequestDto requestDto)
        {
            return await ExecuteAsync(
                async () =>
                {
                    if (!await _validateService.HasPermissionToAccessCourseAsync(requestDto.CourseId))
                        throw new UnauthorizedAccessException("You are not permitted to access this class");

                    if (!await _validateService.ValidateAttendanceCodeAsync(requestDto.AttendanceCodeId))
                        throw new KeyNotFoundException("This attendance code does not exist.");

                    return await _attendanceRepository.InsertStudentAttendanceAsync(requestDto.CourseId, requestDto.AttendanceCodeId, requestDto.TutorialId ?? 0, false);
                },
                $"Error occurred while inserting absent student attendance data"
            );
        }

        public async Task<Result<bool>> GenerateAttendanceRecordsAsync(CreateAttendanceRecordsRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                if (!await _validateService.HasPermissionToAccessCourseAsync(requestDto.CourseId))
                    throw new UnauthorizedAccessException("You are not permitted to access this class");

                if (requestDto.TutorialId > 0 || !requestDto.IsLecture)
                {
                    if (!await _validateService.ValidateTutorialAsync(requestDto.TutorialId ?? 0, requestDto.CourseId))
                        throw new KeyNotFoundException("This tutorial does not exist.");
                }

                var code = new AttendanceRecord
                {
                    AttendanceCode = GenerateRandomAttendanceCode(),
                    Date = requestDto.AttendanceDate,
                    StartTime = requestDto.StartTime,
                    EndTime = requestDto.StartTime.AddMinutes(1),
                    CourseId = requestDto.CourseId,
                    IsLecture = requestDto.IsLecture,
                    TutorialId = requestDto.IsLecture ? null : requestDto.TutorialId,
                    IsDeleted = false
                };
                var saveSuccess = await _attendanceRepository.CreateAttendanceCodeAsync(code);
                if (!saveSuccess)
                    throw new Exception("Failed to save the attendance code.");
                return await _attendanceRepository.InsertStudentAttendanceAsync(requestDto.CourseId, code.RecordId, requestDto.TutorialId ?? 0, true);

            }, "Failed to generate attendance records");

        }

        public async Task<Result<bool>> UpdateStudentAttendanceStatusAsync(UpdateStudentAttendanceStatusRequestDto requestDto)
        {
            return await ExecuteAsync(
                async () =>
                {
                    if (!await _validateService.HasPermissionToAccessCourseAsync(requestDto.CourseId))
                        throw new UnauthorizedAccessException("You are not permitted to access this class");

                    if (!await _validateService.ValidateAttendanceCodeAsync(requestDto.AttendanceCodeId))
                        throw new KeyNotFoundException("This attendance code does not exist.");

                    return await _attendanceRepository.UpdateStudentAttendanceStatusAsync(
                        requestDto.CourseId,
                        requestDto.AttendanceCodeId,
                        requestDto.StudentId,
                        requestDto.IsPresent
                    );
                },
                "Failed to update student attendance status"
            );
        }

        public async Task<Result<List<GetAttendanceRecordByStudentIdResponseDto>>> GetAttendanceOfStudentAsync(DataIdRequestDto requestDto, bool isCurrentWeek = false)
        {
            var studentId = requestDto.IdInString ?? string.Empty;

            return await ExecuteAsync(async () =>
            {
                if (!await _validateService.ValidateStudentAsync(studentId))
                    throw new KeyNotFoundException("Student not found");

                var attendanceRecords = await _attendanceRepository.GetAttendanceDataByStudentIdAsync(studentId);
                if (requestDto.IdInInteger > 0)
                {
                    // filter by course id
                    attendanceRecords = attendanceRecords
                        .Where(a => a.CourseId == requestDto.IdInInteger)
                        .ToList();
                }

                if (isCurrentWeek)
                {
                    // filter by current week
                    var today = DateTime.UtcNow;
                    var currentWeekStart = today.Date.AddDays(-(int)today.DayOfWeek + 1); // Monday
                    var currentWeekEnd = currentWeekStart.AddDays(6); // Sunday
                    attendanceRecords = attendanceRecords
                        .Where(a => 
                            a.DateAndTime.Date >= currentWeekStart && 
                            a.DateAndTime.Date <= currentWeekEnd &&
                            a.IsDeleted == false
                        )
                        .ToList();
                }

                var attendanceRecord = attendanceRecords
                    .Where(a => a.IsDeleted == false)
                    .Select( a => new GetAttendanceRecordByStudentIdResponseDto
                    {
                        IsPresent = a.IsPresent,
                        Date = DateOnly.FromDateTime(a.DateAndTime),
                        AttendanceTime = a.DateAndTime,
                        CourseCode = a.Course?.CourseCode ?? string.Empty,
                        CourseName = a.Course?.CourseName ?? string.Empty,
                        LectureName = a.Course?.User.UserName ?? string.Empty,
                        SessionName = a.Record?.IsLecture == true 
                            ? "Lecture" 
                            : a.Course?.Tutorials
                                .Where(t => t.TutorialId == a.Record?.TutorialId)
                                .FirstOrDefault()?.TutorialName ?? string.Empty
                    }).ToList();

                return attendanceRecord;
            },
            $"Failed to get attendance records of student ID {studentId}");
        }

        public async Task<Result<bool>> SubmitAttendanceAsync(SubmitAttendanceRequestDto requestDto)
        {
            var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Kuala_Lumpur");
            var submittedTime = DateTime.UtcNow;
            var submittedTimeLocal = TimeZoneInfo.ConvertTime(DateTime.Now, timeZone);

            return await ExecuteAsync(async () =>
            {
                if (!await _validateService.ValidateStudentAsync(requestDto.StudentId))
                    throw new KeyNotFoundException("Student not found");
                
                var studentFingerprint = await _userRepository.GetFingerprintByStudentIdAsync(requestDto.StudentId);
                if (studentFingerprint.BindDate == DateOnly.MinValue || studentFingerprint.FingerprintHash == null)
                    throw new KeyNotFoundException("You have not bound your device");

                var attendanceCodeDetails = await _attendanceRepository.GetAttendanceCodeDetailsByCodeAsync(requestDto.AttendanceCode);
                if (attendanceCodeDetails == null)
                    throw new KeyNotFoundException("Attendance code not found");
                
                if (!attendanceCodeDetails.EndTime.HasValue)
                    throw new Exception("Invalid attendance end time");

                // Adjust for timezone differences
                var submittedTimeUtc = submittedTime.ToUniversalTime(); // Convert submitted time to UTC
                var attendanceCodeEndTime = attendanceCodeDetails.EndTime.Value; // Get the end time
                var attendanceCodeEndTimeUtc = attendanceCodeDetails.Date.ToDateTime(attendanceCodeEndTime).ToUniversalTime(); // Convert end time to UTC

                var isAttendanceCodeExpired = submittedTimeUtc > attendanceCodeEndTimeUtc; // Compare in UTC
                if (isAttendanceCodeExpired)
                    throw new InvalidOperationException("Attendance code expired");
                
                var isValidStudent = await _courseRepository.HasStudentEnrolledInCourseAsync(requestDto.StudentId, attendanceCodeDetails.CourseId);
                if (!isValidStudent)
                    throw new InvalidOperationException("You are not enrolled in this class");

                if (!attendanceCodeDetails.IsLecture)
                {
                    var isStudentInTutorial = await _courseRepository.HasStudentEnrolledInTutorialAsync(requestDto.StudentId, attendanceCodeDetails.CourseId, attendanceCodeDetails.TutorialId ?? 0);
                    if (!isStudentInTutorial)
                        throw new InvalidOperationException("You are not enrolled in this tutorial");
                }

                var isStudentDuplicated = await _attendanceRepository.HasAttendanceRecordExistedAsync(requestDto.StudentId, attendanceCodeDetails.RecordId);
                if (isStudentDuplicated)
                    throw new InvalidOperationException("You have already submitted attendance");

                var attendanceData = new StudentAttendance
                {
                    StudentId = requestDto.StudentId,
                    DateAndTime = submittedTimeLocal,
                    CourseId = attendanceCodeDetails.CourseId,
                    IsPresent = true,
                    Remark = $"Present at {submittedTimeLocal}",
                    RecordId = attendanceCodeDetails.RecordId,
                    IsDeleted = false
                };

                await _attendanceRepository.CreateAttendanceDataAsync(attendanceData);
                return true;
            },
            $"Failed to submit attendance for student ID {requestDto.StudentId}");
        }

        public async Task<Result<bool>> DeleteAttendanceRecordAsync(DeleteRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                if (!await _validateService.ValidateAttendanceCodeAsync(requestDto.Id))
                    throw new KeyNotFoundException("Attendance code not found");

                return await _attendanceRepository.DeleteAttendanceRecordAsync(requestDto.Id);
            }, "Failed to delete attendance record");
        }
    
    }
}