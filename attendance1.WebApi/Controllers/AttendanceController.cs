namespace attendance1.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Policy = "AdminAndLecturer")]
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

        
    }
}