namespace attendance1.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Policy = "AdminOnly")]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly ILogger<AccountController> _logger;

        public AccountController(IAccountService accountService, ILogger<AccountController> logger)
        {
            _accountService = accountService ?? throw new ArgumentNullException(nameof(accountService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        #region get selection list
        [HttpPost("getLecturerSelection")]
        public async Task<ActionResult<GetLecturerSelectionResponseDto>> GetLecturerSelection()
        {
            var result = await _accountService.GetLecturerSelectionAsync();
            return StatusCode((int)result.StatusCode, result);
        }
        #endregion

        #region Account CRUD
        [HttpPost("getAllLecturer")]
        public async Task<ActionResult<PaginatedResult<GetLecturerResponseDto>>> GetAllLecturer([FromBody] GetLecturerRequestDto requestDto)
        {
            var result = await _accountService.GetAllLecturerWithClassAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("getAllStudent")]
        public async Task<ActionResult<PaginatedResult<GetStudentResponseDto>>> GetAllStudent([FromBody] GetStudentRequestDto requestDto)
        {
            var result = await _accountService.GetAllStudentWithClassAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("createNewUser")]
        public async Task<ActionResult<bool>> CreateNewUser([FromBody] CreateAccountRequestDto requestDto)
        {
            var result = await _accountService.CreateNewUserAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("editUser")]
        public async Task<ActionResult<bool>> EditUser([FromBody] EditProfileRequestDto requestDto)
        {
            var result = await _accountService.EditUserAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("resetPassword")]
        public async Task<ActionResult<bool>> ResetPassword([FromBody] DataIdRequestDto requestDto)
        {
            var result = await _accountService.ResetPasswordAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("deleteUser")]
        public async Task<ActionResult<bool>> DeleteUser([FromBody] DeleteRequestDto requestDto)
        {
            var result = await _accountService.DeleteUserAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }
        
        [HttpPost("multipleDeleteUser")]
        public async Task<ActionResult<bool>> MultipleDeleteUser([FromBody] List<DeleteRequestDto> requestDto)
        {
            var result = await _accountService.MultipleDeleteUserAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }
        #endregion
    }
}

