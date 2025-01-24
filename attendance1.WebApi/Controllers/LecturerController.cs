namespace attendance1.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Policy = "AdminAndLecturer")]
    public class LecturerController : ControllerBase
    {
        private readonly ILectureService _lectureService;
        private readonly ILogger<LecturerController> _logger;

        public LecturerController(ILectureService lectureService, ILogger<LecturerController> logger)
        {
            _lectureService = lectureService ?? throw new ArgumentNullException(nameof(lectureService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        

        [HttpPost("getClassDetails")]
        public async Task<ActionResult<GetClassDetailsResponseDto>> GetClassDetails([FromBody] DataIdRequestDto requestDto)
        {
            var classDetails = await _lectureService.GetClassDetailsAsync(requestDto);
            return StatusCode((int)classDetails.StatusCode, classDetails);
        }

        [HttpPost("getClassDetailsWithAttendanceData")]
        public async Task<ActionResult<GetClassDetailsWithAttendanceDataResponseDto>> GetClassDetailsWithAttendanceData([FromBody] DataIdRequestDto requestDto)
        {
            var classDetails = await _lectureService.GetClassDetailsWithAttendanceDataAsync(requestDto);
            return StatusCode((int)classDetails.StatusCode, classDetails);
        }

        [HttpPost("createNewClass")]
        public async Task<ActionResult<DataIdResponseDto>> CreateNewClass([FromBody] CreateClassRequestDto requestDto)
        {
            var newClassId = await _lectureService.CreateNewClassAsync(requestDto);
            return StatusCode((int)newClassId.StatusCode, newClassId);
        }

        [HttpPost("editClassDetails")]
        public async Task<ActionResult<bool>> EditClassDetails([FromBody] EditClassRequestDto requestDto)
        {
            var result = await _lectureService.EditClassAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("deleteClass")]
        public async Task<ActionResult<bool>> DeleteClass([FromBody] DeleteRequestDto requestDto)
        {
            var result = await _lectureService.DeleteClassAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        // [HttpPost("getEnrolledStudents")]
        // public async Task<ActionResult<List<GetEnrolledStudentResponseDto>>> GetEnrolledStudents([FromBody] GetEnrolledStudentRequestDto requestDto)
        // {
        //     var students = await _lectureService.GetEnrolledStudentsAsync(requestDto);
        //     return StatusCode((int)students.StatusCode, students);
        // }

        // [HttpPost("getAvailableStudents")]
        // public async Task<ActionResult<List<GetAvailableStudentResponseDto>>> GetAvailableStudents([FromBody] GetAvailableStudentRequestDto requestDto)
        // {
        //     var students = await _lectureService.GetAvailableStudentsAsync(requestDto);
        //     return StatusCode((int)students.StatusCode, students);
        // }

        [HttpPost("addStudentToClass")]
        public async Task<ActionResult<bool>> AddStudentToClass([FromBody] AddStudentToClassRequestDto requestDto)
        {
            var result = await _lectureService.AddStudentToClassAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        // [HttpPost("removeStudentFromClass")]
        // public async Task<ActionResult<bool>> RemoveStudentFromClass([FromBody] RemoveStudentFromClassRequestDto requestDto)
        // {
        //     var result = await _lectureService.RemoveStudentFromClassAsync(requestDto);
        //     return StatusCode((int)result.StatusCode, result);
        // }

        [HttpPost("addStudentToTutorial")]
        public async Task<ActionResult<bool>> AddStudentToTutorial([FromBody] AddStudentToTutorialRequestDto requestDto)
        {
            var result = await _lectureService.AddStudentToTutorialAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("removeStudentFromTutorial")]
        public async Task<ActionResult<bool>> RemoveStudentFromTutorial([FromBody] RemoveStudentFromTutorialRequestDto requestDto)
        {
            var result = await _lectureService.RemoveStudentFromTutorialAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("createNewTutorial")]
        public async Task<ActionResult<bool>> CreateNewTutorial([FromBody] CreateTutorialRequestDto requestDto)
        {
            var result = await _lectureService.CreateNewTutorialAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("editTutorial")]
        public async Task<ActionResult<bool>> EditTutorial([FromBody] EditTutorialRequestDto requestDto)
        {
            var result = await _lectureService.EditTutorialAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("deleteTutorial")]
        public async Task<ActionResult<bool>> DeleteTutorial([FromBody] DeleteRequestDto requestDto)
        {
            var result = await _lectureService.DeleteTutorialAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        

        [HttpPost("insertAbsentStudentAttendance")]
        public async Task<ActionResult<bool>> InsertAbsentStudentAttendance([FromBody] CreateAbsentStudentAttendanceRequestDto requestDto)
        {
            var result = await _lectureService.InsertAbsentStudentAttendanceAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("editAttendanceData")]
        public async Task<ActionResult<bool>> EditAttendanceData([FromBody] EditAttendanceDataRequestDto requestDto)
        {
            var result = await _lectureService.ChangeAttendanceDataOfStudentAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }
    }
}

