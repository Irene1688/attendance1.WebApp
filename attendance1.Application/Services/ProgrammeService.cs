namespace attendance1.Application.Services
{
    public class ProgrammeService : BaseService, IProgrammeService
    {
        private readonly IValidateService _validateService;
        private readonly IProgrammeRepository _programmeRepository;
        private readonly IUserRepository _userRepository;

        public ProgrammeService(ILogger<ProgrammeService> logger, IValidateService validateService, IProgrammeRepository programmeRepository, IUserRepository userRepository, LogContext logContext)
            : base(logger, logContext)
        {
            _validateService = validateService ?? throw new ArgumentNullException(nameof(validateService));
            _programmeRepository = programmeRepository ?? throw new ArgumentNullException(nameof(programmeRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        }

        private string FormatName(string name)
        {
            var match = Regex.Match(name, @"(.+?)(\s*\(.*\))?\s*(\d+)?$");
            
            var outsideBrackets = match.Groups[1].Value.Trim();
            var insideBrackets = match.Groups[2].Success ? match.Groups[2].Value : null;
            var number = match.Groups[3].Success ? match.Groups[3].Value : null;

            var formattedOutside = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(outsideBrackets.ToLower());

            var result = formattedOutside;
            if (insideBrackets != null)
            {
                result += " " + insideBrackets;
            }
            if (number != null)
            {
                result += " " + number;
            }

            return result;
        }

        public async Task<Result<GetProgrammeSelectionResponseDto>> GetProgrammeSelectionAsync()
        {
            return await ExecuteAsync(async () =>
            {
                var programmes = await _programmeRepository.GetProgrammeSelectionAsync();
                var response = new GetProgrammeSelectionResponseDto
                {
                    Programmes = programmes.Select(p => new DataIdResponseDto
                    {
                        Id = p.id,
                        Name = p.name
                    }).ToList()
                };
                return response;
            }, "Failed to get programme selection");
        }
        
        public async Task<Result<bool>> CreateNewProgrammeAsync(CreateProgrammeRequestDto requestDto) 
        {
            return await ExecuteAsync(async () =>
            {
                var isExisted = await _validateService.HasProgrammeNameExistedAsync(requestDto.ProgrammeName);
                if (isExisted)
                    throw new InvalidOperationException("The programme name has been used");

                var programme = new Programme
                {
                    ProgrammeName = FormatName(requestDto.ProgrammeName),
                    IsDeleted = false,
                };

                await _programmeRepository.CreateNewProgrammeAsync(programme);
                return true;
            },
            $"Failed to create new programme");
        }
        
        public async Task<Result<PaginatedResult<GetProgrammeResponseDto>>> GetAllProgrammeAsync(GetProgrammeRequestDto requestDto)
        {
            var pageNumber = requestDto.PaginatedRequest.PageNumber;
            var pageSize = requestDto.PaginatedRequest.PageSize;
            var searchTerm = requestDto.SearchTerm;
            var orderBy = requestDto.PaginatedRequest.OrderBy;
            var isAscending = requestDto.PaginatedRequest.IsAscending;
            return await ExecuteAsync(async () =>
            {
                var programmes = await _programmeRepository.GetAllProgrammeAsync(pageNumber, pageSize, searchTerm, orderBy, isAscending);
                var response = programmes.Select(programme => new GetProgrammeResponseDto
                {
                    ProgrammeId = programme.ProgrammeId,
                    ProgrammeName = programme.ProgrammeName, 
                }).ToList();
                
                var paginatedResult = new PaginatedResult<GetProgrammeResponseDto>(
                    response, 
                    await _programmeRepository.GetTotalProgrammeAsync(searchTerm),
                    pageNumber, 
                    pageSize
                );
                return paginatedResult;
            }, 
            "Failed to get all programmes");
        }

        public async Task<Result<bool>> EditProgrammeAsync(EditProgrammeRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                if (!await _validateService.HasProgrammeAsync(requestDto.ProgrammeId))
                    throw new KeyNotFoundException("Programme not found");

                if (await _validateService.HasProgrammeNameExistedAsync(requestDto.ProgrammeName))
                    throw new InvalidOperationException("The programme name has been used");

                var programme = new Programme
                {
                    ProgrammeId = requestDto.ProgrammeId,
                    ProgrammeName = FormatName(requestDto.ProgrammeName),
                };
                await _programmeRepository.EditProgrammeAsync(programme);
                return true;
            },
            $"Failed to edit programme");

        }
        
        public async Task<Result<bool>> DeleteProgrammeAsync(DeleteRequestDto requestDto)
        {
            return await ExecuteAsync(async () =>
            {
                if (!await _validateService.HasProgrammeAsync(requestDto.Id))
                    throw new KeyNotFoundException("Programme not found");

                await _programmeRepository.DeleteProgrammeAsync(requestDto.Id);
                return true;
            },
            $"Failed to delete programme with ID {requestDto.Id}");
        }
    }
}