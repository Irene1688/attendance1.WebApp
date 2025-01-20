namespace attendance1.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Policy = "AdminOnly")]
    public class ProgrammeController : ControllerBase
    {
        private readonly IProgrammeService _programmeService;
        private readonly ILogger<ProgrammeController> _logger;

        public ProgrammeController(IProgrammeService programmeService, ILogger<ProgrammeController> logger)
        {
            _programmeService = programmeService ?? throw new ArgumentNullException(nameof(programmeService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        #region get selection list
        [HttpPost("getProgrammeSelection")]
        public async Task<ActionResult<GetProgrammeSelectionResponseDto>> GetProgrammeSelection()
        {
            var result = await _programmeService.GetProgrammeSelectionAsync();
            return StatusCode((int)result.StatusCode, result);
        }
        #endregion

        #region Programme CRUD
        [HttpPost("createNewProgramme")]
        public async Task<ActionResult<bool>> CreateNewProgramme([FromBody] CreateProgrammeRequestDto requestDto)
        {
            var result = await _programmeService.CreateNewProgrammeAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("getAllProgramme")]
        public async Task<ActionResult<PaginatedResult<GetProgrammeResponseDto>>> GetAllProgramme([FromBody] GetProgrammeRequestDto requestDto)
        {
            var result = await _programmeService.GetAllProgrammeAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("editProgramme")]
        public async Task<ActionResult<bool>> EditProgramme([FromBody] EditProgrammeRequestDto requestDto)
        {
            var result = await _programmeService.EditProgrammeAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("deleteProgramme")]
        public async Task<ActionResult<bool>> DeleteProgramme([FromBody] DeleteRequestDto requestDto)
        {
            var result = await _programmeService.DeleteProgrammeAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }
        #endregion
    }
}