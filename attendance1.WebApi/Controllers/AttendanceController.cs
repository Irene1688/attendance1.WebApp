namespace attendance1.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Policy = "AllLoginedUser")]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;
        private readonly ILogger<AttendanceController> _logger;

        public AttendanceController(IAttendanceService attendanceService, ILogger<AttendanceController> logger)
        {
            _attendanceService = attendanceService ?? throw new ArgumentNullException(nameof(attendanceService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpPost("generateAttendanceCode")]
        public async Task<ActionResult<GetAttendanceCodeResponseDto>> GenerateAttendanceCode([FromBody] CreateAttendanceCodeRequestDto requestDto)
        {
            var result = await _attendanceService.GenerateAttendanceCodeAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("getAttendanceRecordByCourseId")]
        public async Task<ActionResult<PaginatedResult<GetAttendanceRecordByCourseIdResponseDto>>> GetAttendanceRecordByCourseId([FromBody] GetAttendanceRecordByCourseIdRequestDto requestDto)
        {
            var result = await _attendanceService.GetAttendanceRecordByCourseIdAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("getCourseStudentAttendanceRecords")]
        public async Task<ActionResult<GetStudentAttendanceDataByCourseIdResponseDto>> GetCourseStudentAttendanceRecords([FromBody] DataIdRequestDto requestDto)
        {
            var result = await _attendanceService.GetCourseStudentAttendanceRecordsAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("markAbsentForUnattended")]
        public async Task<ActionResult<bool>> MarkAbsentForUnattended([FromBody] CreateAbsentStudentAttendanceRequestDto requestDto)
        {
            var result = await _attendanceService.InsertAbsentStudentAttendanceAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("generateAttendanceRecords")]
        public async Task<ActionResult<bool>> GenerateAttendanceRecords([FromBody] CreateAttendanceRecordsRequestDto requestDto)
        {
            var result = await _attendanceService.GenerateAttendanceRecordsAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("updateStudentAttendanceStatus")]
        public async Task<ActionResult<bool>> UpdateStudentAttendanceStatus([FromBody] UpdateStudentAttendanceStatusRequestDto requestDto)
        {
            var result = await _attendanceService.UpdateStudentAttendanceStatusAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("getAttendanceOfStudent")]
        public async Task<ActionResult<List<GetAttendanceRecordByStudentIdResponseDto>>> GetAttendanceOfStudent([FromBody] DataIdRequestDto requestDto, [FromQuery] bool isCurrentWeek = false)
        {
            var result = await _attendanceService.GetAttendanceOfStudentAsync(requestDto, isCurrentWeek);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("submitAttendance")]
        public async Task<ActionResult<bool>> SubmitAttendance([FromBody] CreateAttendanceRecordRequestDto requestDto)
        {
            var result = await _attendanceService.SubmitAttendanceAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }



    }
}