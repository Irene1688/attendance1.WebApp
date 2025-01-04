using attendance1.Application.DTOs.Common;
using attendance1.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using attendance1.Domain.Interfaces;

namespace attendance1.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService ?? throw new ArgumentNullException(nameof(authService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpPost("studentLogin")]
        public async Task<ActionResult<LoginResponseDto>> StudentLogin([FromBody] StudentLoginRequestDto requestDto)
        {
            var result = await _authService.StudentLoginAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("staffLogin")]
        public async Task<ActionResult<LoginResponseDto>> StaffLogin([FromBody] StaffLoginRequestDto requestDto)
        {
            var result = await _authService.StaffLoginAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("logout")]
        public async Task<ActionResult<bool>> Logout([FromBody] LogoutRequestDto requestDto)
        {
            var result = await _authService.LogoutAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("refreshToken")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto requestDto)
        {
            var result = await _authService.RefreshAccessTokenAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }
    }
}
