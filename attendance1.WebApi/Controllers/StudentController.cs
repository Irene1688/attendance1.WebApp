using attendance1.Application.DTOs.Common;
using attendance1.Application.DTOs.Student;
using attendance1.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace attendance1.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Policy = "StudentOnly")]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _studentService;
        private readonly ILogger<StudentController> _logger;

        public StudentController(IStudentService studentService, ILogger<StudentController> logger)
        {
            _studentService = studentService ?? throw new ArgumentNullException(nameof(studentService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpPost("viewAttendanceInCurrentWeek")]
        public async Task<ActionResult<List<GetAttendanceRecordResponseDto>>> ViewAttendanceInCurrentWeek([FromBody] DataIdRequestDto requestDto)
        {
            var result = await _studentService.GetAttendanceInCurrentWeekAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("submitAttendance")]
        public async Task<ActionResult<bool>> SubmitAttendance([FromBody] CreateAttendanceRecordRequestDto requestDto)
        {
            var result = await _studentService.SubmitAttendanceAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("getEnrollmentClasses")]
        public async Task<ActionResult<List<GetAttendanceRecordResponseDto>>> GetEnrollmentClasses([FromBody] DataIdRequestDto requestDto)
        {
            var result = await _studentService.GetEnrollmentClassesAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("getClassDetailsWithAttendance")]
        public async Task<ActionResult<GetClassDetailsWithAttendanceResponseDto>> GetClassDetailsWithAttendance([FromBody] DataIdRequestDto requestDto)
        {
            var result = await _studentService.GetClassDetailsWithAttendanceByStudentIdAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("getAllAttendance")]
        public async Task<ActionResult<List<GetAttendanceRecordResponseDto>>> GetAllAttendance([FromBody] DataIdRequestDto requestDto)
        {
            var result = await _studentService.GetAllAttendanceByStudentIdAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

    }
}
