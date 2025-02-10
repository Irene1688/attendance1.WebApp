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
    }
}
