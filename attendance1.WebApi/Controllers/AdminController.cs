namespace attendance1.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Policy = "AdminOnly")]
    //[AllowAnonymous]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly ILogger<AdminController> _logger;

        public AdminController(IAdminService adminService, ILogger<AdminController> logger)
        {
            _adminService = adminService ?? throw new ArgumentNullException(nameof(adminService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpPost("getAllTotalCount")]
        public async Task<ActionResult<AllTotalCountResponseDto>> GetAllTotalCount()
        {
            var result = await _adminService.GetAllTotalCountAsync();
            return StatusCode((int)result.StatusCode, result);
        }

        #region Programme CRUD
        // [HttpPost("createNewProgramme")]
        // public async Task<ActionResult<bool>> CreateNewProgramme([FromBody] CreateProgrammeRequestDto requestDto)
        // {
        //     var result = await _adminService.CreateNewProgrammeAsync(requestDto);
        //     return StatusCode((int)result.StatusCode, result);
        // }

        // [HttpPost("getProgrammeSelection")]
        // public async Task<ActionResult<GetProgrammeSelectionResponseDto>> GetProgrammeSelection()
        // {
        //     var result = await _adminService.GetProgrammeSelectionAsync();
        //     return StatusCode((int)result.StatusCode, result);
        // }

        // [HttpPost("getAllProgramme")]
        // public async Task<ActionResult<PaginatedResult<GetProgrammeResponseDto>>> GetAllProgramme([FromBody] GetProgrammeRequestDto requestDto)
        // {
        //     var result = await _adminService.GetAllProgrammeAsync(requestDto);
        //     return StatusCode((int)result.StatusCode, result);
        // }

        // [HttpPost("editProgramme")]
        // public async Task<ActionResult<bool>> EditProgramme([FromBody] EditProgrammeRequestDto requestDto)
        // {
        //     var result = await _adminService.EditProgrammeAsync(requestDto);
        //     return StatusCode((int)result.StatusCode, result);
        // }

        // [HttpPost("deleteProgramme")]
        // public async Task<ActionResult<bool>> DeleteProgramme([FromBody] DeleteRequestDto requestDto)
        // {
        //     var result = await _adminService.DeleteProgrammeAsync(requestDto);
        //     return StatusCode((int)result.StatusCode, result);
        // }
        #endregion

        #region User CRUD
        // [HttpPost("createNewUser")]
        // public async Task<ActionResult<bool>> CreateNewUser([FromBody] CreateAccountRequestDto requestDto)
        // {
        //     var result = await _adminService.CreateNewUserAsync(requestDto);
        //     return StatusCode((int)result.StatusCode, result);
        // }

        // [HttpPost("editUser")]
        // public async Task<ActionResult<bool>> EditUser([FromBody] EditProfileRequestDto requestDto)
        // {
        //     var result = await _adminService.EditUserAsync(requestDto);
        //     return StatusCode((int)result.StatusCode, result);
        // }

        // [HttpPost("deleteUser")]
        // public async Task<ActionResult<bool>> DeleteUser([FromBody] DeleteRequestDto requestDto)
        // {
        //     var result = await _adminService.DeleteUserAsync(requestDto);
        //     return StatusCode((int)result.StatusCode, result);
        // }

        // [HttpPost("multipleDeleteUser")]
        // public async Task<ActionResult<bool>> MultipleDeleteUser([FromBody] List<DeleteRequestDto> requestDto)
        // {
        //     var result = await _adminService.MultipleDeleteUserAsync(requestDto);
        //     return StatusCode((int)result.StatusCode, result);
        // }

        // [HttpPost("resetPassword")]
        // public async Task<ActionResult<bool>> ResetPassword([FromBody] DataIdRequestDto requestDto)
        // {
        //     var result = await _adminService.ResetPasswordAsync(requestDto);
        //     return StatusCode((int)result.StatusCode, result);
        // }

        // [HttpPost("getAllLecturer")]
        // public async Task<ActionResult<PaginatedResult<GetLecturerResponseDto>>> GetAllLecturer([FromBody] GetLecturerRequestDto requestDto)
        // {
        //     var result = await _adminService.GetAllLecturerWithClassAsync(requestDto);
        //     return StatusCode((int)result.StatusCode, result);
        // }

        // [HttpPost("getLecturerSelection")]
        // public async Task<ActionResult<GetLecturerSelectionResponseDto>> GetLecturerSelection()
        // {
        //     var result = await _adminService.GetLecturerSelectionAsync();
        //     return StatusCode((int)result.StatusCode, result);
        // }

        // [HttpPost("getAllStudent")]
        // public async Task<ActionResult<PaginatedResult<GetStudentResponseDto>>> GetAllStudent([FromBody] GetStudentRequestDto requestDto)
        // {
        //     var result = await _adminService.GetAllStudentWithClassAsync(requestDto);
        //     return StatusCode((int)result.StatusCode, result);
        // }
        #endregion

        #region Class CRUD
        // [HttpPost("createNewCourse")]
        // public async Task<ActionResult<bool>> CreateNewCourse([FromBody] CreateCourseRequestDto requestDto)
        // {
        //     var result = await _adminService.CreateNewCourseAsync(requestDto);
        //     return StatusCode((int)result.StatusCode, result);
        // }

        // [HttpPost("getAllCourse")]
        // public async Task<ActionResult<PaginatedResult<GetCourseResponseDto>>> GetAllCourse([FromBody] GetCourseRequestDto requestDto)
        // {
        //     var result = await _adminService.GetAllCourseAsync(requestDto);
        //     return StatusCode((int)result.StatusCode, result);
        // }

        // [HttpPost("editCourse")]
        // public async Task<ActionResult<bool>> EditCourse([FromBody] EditCourseRequestDto requestDto)
        // {
        //     var result = await _adminService.EditCourseAsync(requestDto);
        //     return StatusCode((int)result.StatusCode, result);
        // }

        // [HttpPost("deleteCourse")]
        // public async Task<ActionResult<bool>> DeleteCourse([FromBody] DeleteRequestDto requestDto)
        // {
        //     var result = await _adminService.DeleteCourseAsync(requestDto);
        //     return StatusCode((int)result.StatusCode, result);
        // }

        // [HttpPost("multipleDeleteCourse")]
        // public async Task<ActionResult<bool>> MultipleDeleteCourse([FromBody] List<DeleteRequestDto> requestDto)
        // {
        //     var result = await _adminService.MultipleDeleteCourseAsync(requestDto);
        //     return StatusCode((int)result.StatusCode, result);
        // }

        // [HttpPost("addStudentsToCourse")]
        // public async Task<ActionResult<bool>> AddStudentsToCourse([FromBody] AddStudentsToCourseRequestDto requestDto)
        // {
        //     var result = await _adminService.AddStudentsToCourseAsync(requestDto);
        //     return StatusCode((int)result.StatusCode, result);
        // }

        // [HttpPost("getAttendanceRecordByCourseId")]
        // public async Task<ActionResult<PaginatedResult<GetAttendanceRecordByCourseIdResponseDto>>> GetAttendanceRecordByCourseId([FromBody] GetAttendanceRecordByCourseIdRequestDto requestDto)
        // {
        //     var result = await _adminService.GetAttendanceRecordByCourseIdAsync(requestDto);
        //     return StatusCode((int)result.StatusCode, result);
        // }
        #endregion
    }
}
