namespace attendance1.Application.Services
{
    public class AttendanceService : BaseService, IAttendanceService
    {
        private readonly IAttendanceRepository _attendanceRepository;
        private readonly IValidateService _validateService;

        public AttendanceService(ILogger<AttendanceService> logger, IValidateService validateService, IAttendanceRepository attendanceRepository, LogContext logContext)
            : base(logger, logContext)
        {
            _validateService = validateService ?? throw new ArgumentNullException(nameof(validateService));
            _attendanceRepository = attendanceRepository ?? throw new ArgumentNullException(nameof(attendanceRepository));
        }

        private string GenerateRandomAttendanceCode()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        public async Task<Result<PaginatedResult<GetAttendanceRecordByCourseIdResponseDto>>> GetAttendanceRecordByCourseIdAsync(GetAttendanceRecordByCourseIdRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
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
                    PresentCount = studentAttendance.Count(sa => 
                        sa.RecordId == ar.RecordId && 
                        sa.IsPresent == true),
                    AbsentCount = studentAttendance.Count(sa => 
                        sa.RecordId == ar.RecordId && 
                        sa.IsPresent == false),
                    AttendanceRate = studentAttendance
                        .Where(sa => sa.RecordId == ar.RecordId)
                        .Average(sa => sa.IsPresent ? 1 : 0),
                    // alternative way to calculate attendance rate
                    // AttendanceRate = studentAttendance.Count(sa => sa.RecordId == ar.RecordId) > 0
                    //     ? (double)studentAttendance.Count(sa => sa.RecordId == ar.RecordId && sa.IsPresent) / studentAttendance.Count(sa => sa.RecordId == ar.RecordId)
                    //     : 0
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
                    case "startTime":
                        sortedResponse = isAscending 
                            ? response.OrderBy(r => r.StartTime) 
                            : response.OrderByDescending(r => r.StartTime);
                        break;
                    case "endTime":
                        sortedResponse = isAscending 
                            ? response.OrderBy(r => r.EndTime) 
                            : response.OrderByDescending(r => r.EndTime);
                        break;
                    case "isLecture":
                        sortedResponse = isAscending 
                            ? response.OrderBy(r => r.IsLecture) 
                            : response.OrderByDescending(r => r.IsLecture);
                        break;
                    case "tutorialName":
                        sortedResponse = isAscending 
                            ? response.OrderBy(r => r.TutorialName) 
                            : response.OrderByDescending(r => r.TutorialName);
                        break;
                    case "presentCount":
                        sortedResponse = isAscending 
                            ? response.OrderBy(r => r.PresentCount) 
                            : response.OrderByDescending(r => r.PresentCount);
                        break;
                    case "absentCount":
                        sortedResponse = isAscending 
                            ? response.OrderBy(r => r.AbsentCount) 
                            : response.OrderByDescending(r => r.AbsentCount);
                        break;
                    case "attendanceRate":
                        sortedResponse = isAscending 
                            ? response.OrderBy(r => r.AttendanceRate) 
                            : response.OrderByDescending(r => r.AttendanceRate);
                        break;
                    default:
                        sortedResponse = response.OrderBy(r => r.RecordId); // Default sorting
                        break;
                }
                // if (orderBy == "date")
                // {
                //     response = response.OrderBy(r => r.Date).ToList();
                // }
                // else if (orderBy == "startTime")
                // {
                //     response = response.OrderBy(r => r.StartTime).ToList();
                // }
                // else if (orderBy == "endTime")
                // {
                //     response = response.OrderBy(r => r.EndTime).ToList();
                // }
                // else if (orderBy == "isLecture")
                // {
                //     response = response.OrderBy(r => r.IsLecture).ToList();
                // }
                // else if (orderBy == "tutorialName")
                // {
                //     response = response.OrderBy(r => r.TutorialName).ToList();
                // }
                // else if (orderBy == "presentCount")
                // {
                //     response = response.OrderBy(r => r.PresentCount).ToList();
                // }
                // else if (orderBy == "absentCount")
                // {
                //     response = response.OrderBy(r => r.AbsentCount).ToList();
                // }
                // else if (orderBy == "attendanceRate")
                // {
                //     response = response.OrderBy(r => r.AttendanceRate).ToList();
                // }

                // Paging
                var pagedResponse = response.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();

                // Pagination
                var paginatedResult = new PaginatedResult<GetAttendanceRecordByCourseIdResponseDto>(
                    pagedResponse,
                    attendanceRecords.Count,
                    pageNumber,
                    pageSize
                );

                return paginatedResult;
            }, "Failed to get attendance record by course ID");
        }

        public async Task<Result<GetAttendanceCodeResponseDto>> GenerateAttendanceCodeAsync(CreateAttendanceCodeRequestDto requestDto)
        {
            return await ExecuteAsync(
                async () =>
                {
                    if (!await _validateService.ValidateCourseAsync(requestDto.CourseId))
                        throw new KeyNotFoundException("This class does not exist.");

                    if (requestDto.TutorialId < 0 && !await _validateService.ValidateTutorialAsync(requestDto.TutorialId ?? 0, requestDto.CourseId))
                        throw new KeyNotFoundException("This tutorial does not exist.");

                    var code = new AttendanceRecord
                    {
                        AttendanceCode = GenerateRandomAttendanceCode(),
                        Date = DateOnly.FromDateTime(DateTime.Now),
                        StartTime = TimeOnly.FromDateTime(DateTime.Now),
                        EndTime = TimeOnly.FromDateTime(DateTime.Now.AddSeconds(requestDto.DurationInSeconds)),
                        CourseId = requestDto.CourseId,
                        IsLecture = requestDto.IsLecture,
                        TutorialId = requestDto.IsLecture ? null : requestDto.TutorialId
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
    }
}