namespace attendance1.Application.Services
{
    public class StudentService : BaseService, IStudentService
    {
        private readonly IValidateService _validateService;
        private readonly IUserRepository _userRepository;
        private readonly IAttendanceRepository _attendanceRepository;
        private readonly ICourseRepository _courseRepository;

        public StudentService(ILogger<StudentService> logger, IValidateService validateService, IUserRepository userRepository, IAttendanceRepository attendanceRepository, ICourseRepository courseRepository, LogContext logContext)
            : base(logger, logContext)
        {
            _validateService = validateService ?? throw new ArgumentNullException(nameof(validateService));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _attendanceRepository = attendanceRepository ?? throw new ArgumentNullException(nameof(attendanceRepository));
            _courseRepository = courseRepository ?? throw new ArgumentNullException(nameof(courseRepository));
        }


        // public async Task<Result<List<GetAttendanceRecordResponseDto>>> GetAttendanceInCurrentWeekAsync(DataIdRequestDto requestDto)
        // {
        //     var studentId = requestDto.IdInString ?? string.Empty;
        //     if (!await _validateService.ValidateStudentAsync(studentId))
        //         return Result<List<GetAttendanceRecordResponseDto>>.FailureResult("Student not found", HttpStatusCode.NotFound);

        //     return await ExecuteAsync(async () =>
        //     {
        //         var today = DateTime.UtcNow;
        //         var currentWeekStart = today.Date.AddDays(-(int)today.DayOfWeek + 1); // Monday
        //         var currentWeekEnd = currentWeekStart.AddDays(6); // Sunday

        //         var attendanceRecords = await _attendanceRepository.GetAttendanceDataByStudentIdAsync(studentId);
        //         var filteredRecords = attendanceRecords
        //             .Where(a => a.DateAndTime.Date >= currentWeekStart && a.DateAndTime.Date <= currentWeekEnd)
        //             .ToList();

        //         var attendanceRecordTasks = filteredRecords.Select(async a =>
        //         {
        //             var lecturerName = await _userRepository.GetLecturerNameByLecturerIdAsync(a.Course?.LecturerId ?? string.Empty);
        //             var tutorialName = await _courseRepository.GetTutorialNameByTutorialIdAsync(a.Record?.TutorialId ?? 0);
        //             return new GetAttendanceRecordResponseDto
        //             {
        //                 IsPresent = a.IsPresent,
        //                 Date = DateOnly.FromDateTime(a.DateAndTime),
        //                 AttendanceTime = a.DateAndTime,
        //                 ClassCode = a.Course?.CourseCode ?? string.Empty,
        //                 ClassName = a.Course?.CourseName ?? string.Empty,
        //                 LectureName = lecturerName,
        //                 SessionName = a.Record?.IsLecture == true 
        //                     ? "Lecture" 
        //                     : tutorialName
        //             };
        //         }).ToList();

        //         var attendanceDataInCurrentWeek = await Task.WhenAll(attendanceRecordTasks);
        //         return attendanceDataInCurrentWeek.ToList();
        //     },
        //     $"Failed to get attendance records of student ID {studentId}");
        // }

        // public async Task<Result<bool>> SubmitAttendanceAsync(CreateAttendanceRecordRequestDto requestDto)
        // {
        //     var submittedTime = DateTime.UtcNow;
            
        //     return await ExecuteAsync(async () =>
        //     {
        //         if (!await _validateService.ValidateStudentAsync(requestDto.StudentId))
        //             throw new KeyNotFoundException("Student not found");
                    
        //         var attendanceCodeDetails = await _attendanceRepository.GetAttendanceCodeDetailsByCodeAsync(requestDto.AttendanceCode);
        //         if (attendanceCodeDetails == null)
        //             throw new KeyNotFoundException("Attendance code not found");
                
        //         if (!attendanceCodeDetails.EndTime.HasValue)
        //             throw new Exception("Invalid attendance end time");
        //         var isAttendanceCodeExpired = submittedTime.TimeOfDay > attendanceCodeDetails.EndTime.Value.ToTimeSpan();
        //         if (isAttendanceCodeExpired)
        //             throw new InvalidOperationException("Attendance code expired");
                
        //         var isValidStudent = await _courseRepository.HasStudentEnrolledInCourseAsync(requestDto.StudentId, attendanceCodeDetails.CourseId);
        //         if (!isValidStudent)
        //             throw new InvalidOperationException("You are not enrolled in this class");

        //         if (!attendanceCodeDetails.IsLecture)
        //         {
        //             var isStudentInTutorial = await _courseRepository.HasStudentEnrolledInTutorialAsync(requestDto.StudentId, attendanceCodeDetails.CourseId, attendanceCodeDetails.TutorialId ?? 0);
        //             if (!isStudentInTutorial)
        //                 throw new InvalidOperationException("You are not enrolled in this tutorial");
        //         }

        //         var isStudentDuplicated = await _attendanceRepository.HasAttendanceRecordExistedAsync(requestDto.StudentId, attendanceCodeDetails.RecordId);
        //         if (isStudentDuplicated)
        //             throw new InvalidOperationException("You have already submitted attendance");

        //         var attendanceData = new StudentAttendance
        //         {
        //             StudentId = requestDto.StudentId,
        //             DateAndTime = submittedTime,
        //             CourseId = attendanceCodeDetails.CourseId,
        //             IsPresent = true,
        //             Remark = $"Present at {submittedTime}",
        //             RecordId = attendanceCodeDetails.RecordId,
        //         };

        //         await _attendanceRepository.CreateAttendanceDataAsync(attendanceData);
        //         return true;
        //     },
        //     $"Failed to submit attendance for student ID {requestDto.StudentId}");
        // }

        // public async Task<Result<List<DataIdResponseDto>>> GetEnrollmentClassesAsync(DataIdRequestDto requestDto)
        // {
        //     var studentId = requestDto.IdInString ?? string.Empty;
        //     if (!await _validateService.ValidateStudentAsync(studentId))
        //         return Result<List<DataIdResponseDto>>.FailureResult("Student not found", HttpStatusCode.NotFound);

        //     return await ExecuteAsync(async () =>
        //     {
        //         var enrollmentClasses = await _courseRepository.GetEnrollmentCoursesByStudentIdAsync(studentId);
        //         return enrollmentClasses.Select(c => new DataIdResponseDto 
        //         {
        //             Id = c.CourseId, 
        //             Name = c.CourseName 
        //         }).ToList();
        //     },
        //     $"Failed to get enrollment classes of student ID {studentId}");
        //}

        // public async Task<Result<GetClassDetailsWithAttendanceResponseDto>> GetClassDetailsWithAttendanceByStudentIdAsync(DataIdRequestDto requestDto)
        // {
        //     var studentId = requestDto.IdInString ?? string.Empty;
        //     var courseId = requestDto.IdInInteger ?? 0;
        //     if (!await _validateService.ValidateStudentAsync(studentId))
        //         return Result<GetClassDetailsWithAttendanceResponseDto>.FailureResult("Student not found", HttpStatusCode.NotFound);

        //     if (!await _validateService.ValidateCourseAsync(courseId))
        //         return Result<GetClassDetailsWithAttendanceResponseDto>.FailureResult("Course not found", HttpStatusCode.NotFound);
            
        //     return await ExecuteAsync(async () =>
        //     {
        //         var attendanceRecords = await _attendanceRepository.GetAttendanceDataByStudentIdAsync(studentId);
                
        //         var course = attendanceRecords.First().Course ?? throw new Exception("Course not found");
        //         var lecturerName = await _userRepository.GetLecturerNameByLecturerIdAsync(attendanceRecords.First().Course?.LecturerId ?? string.Empty);
                
        //         var processedAttendanceRecordsTask = attendanceRecords
        //             .Where(a => a.CourseId == courseId)
        //             .OrderByDescending(a => a.DateAndTime)
        //             .Select(async a =>
        //             {
        //                 var tutorialName = await _courseRepository.GetTutorialNameByTutorialIdAsync(a.Record?.TutorialId ?? 0);
        //                 return new AttendanceDto
        //                 {
        //                     IsPresent = a.IsPresent,
        //                     AttendanceTime = a.DateAndTime,
        //                     SessionName = a.Record?.IsLecture == true 
        //                         ? "Lecture" 
        //                         : tutorialName
        //                 };
        //             });

        //         var attendanceResults = await Task.WhenAll(processedAttendanceRecordsTask);

        //         return new GetClassDetailsWithAttendanceResponseDto 
        //         {
        //             ClassCode = course.CourseCode ?? string.Empty,
        //             ClassName =course.CourseName ?? string.Empty,
        //             LectureName = lecturerName,
        //             AttendanceRecords = attendanceResults.ToList()
        //         };
        //     },
        //     $"Failed to get class details with attendance of student ID {studentId} and course ID {courseId}");
        // }

        public async Task<Result<List<GetAttendanceRecordByStudentIdResponseDto>>> GetAllAttendanceByStudentIdAsync(DataIdRequestDto requestDto)
        {
            var studentId = requestDto.IdInString ?? string.Empty;
            if (!await _validateService.ValidateStudentAsync(studentId))
                return Result<List<GetAttendanceRecordByStudentIdResponseDto>>.FailureResult("Student not found", HttpStatusCode.NotFound);

            return await ExecuteAsync(async () =>
            {
                var attendanceRecords = await _attendanceRepository.GetAttendanceDataByStudentIdAsync(studentId);
                
                var processedAttendanceRecordTasks = attendanceRecords.Select(async a =>
                {
                    var lecturerName = await _userRepository.GetLecturerNameByLecturerIdAsync(a.Course?.LecturerId ?? string.Empty);
                    var tutorialName = await _courseRepository.GetTutorialNameByTutorialIdAsync(a.Record?.TutorialId ?? 0);
                    return new GetAttendanceRecordByStudentIdResponseDto
                    {
                        IsPresent = a.IsPresent,
                        Date = DateOnly.FromDateTime(a.DateAndTime),
                        AttendanceTime = a.DateAndTime,
                        CourseCode = a.Course?.CourseCode ?? string.Empty,
                        CourseName = a.Course?.CourseName ?? string.Empty,
                        LectureName = lecturerName,
                        SessionName = a.Record?.IsLecture == true 
                            ? "Lecture" 
                            : tutorialName
                    };
                }).ToList();

                var result = await Task.WhenAll(processedAttendanceRecordTasks);
                return result.ToList();
            },
            $"Failed to get attendance records of student ID {studentId}");
        }
    }
}