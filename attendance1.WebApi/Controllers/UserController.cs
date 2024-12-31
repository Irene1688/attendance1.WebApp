using attendance1.Application.DTOs.Common;
using attendance1.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace attendance1.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Policy = "AdminOnly")]
    [Authorize(Policy = "LecturerOnly")]
    [Authorize(Policy = "StudentOnly")]
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
        public async Task<ActionResult<ViewProfileResponseDto>> ViewProfile([FromBody] DataIdRequestDto requestDto)
        {
            var result = await _userService.ViewProfileAsync(requestDto);
            return Ok(result);
        }

        [HttpPost("editProfile")]
        public async Task<ActionResult<bool>> EditProfile([FromBody] EditProfileRequestDto requestDto)
        {
            var result = await _userService.EditProfileAsync(requestDto);
            return Ok(result);
        }

        [HttpPost("changePassword")]
        public async Task<ActionResult<bool>> ChangePassword([FromBody] EditPasswordRequestDto requestDto)
        {
            var result = await _userService.ChangePasswordAsync(requestDto);
            return Ok(result);
        }
    }
}
