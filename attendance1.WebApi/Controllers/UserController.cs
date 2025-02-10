namespace attendance1.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Policy = "AllLoginedUser")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, ILogger<UserController> logger)
        {
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpPost("viewProfile")]
        public async Task<ActionResult<ViewProfileResponseDto>> ViewProfile([FromBody] ViewProfileRequestDto requestDto)
        {
            var result = await _userService.ViewProfileAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("editProfileWithPassword")]
        public async Task<ActionResult<bool>> EditProfileWithPassword([FromBody] EditProfileWithPasswordRequestDto requestDto)
        {
            var result = await _userService.EditProfileWithPasswordAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }
    }
}

