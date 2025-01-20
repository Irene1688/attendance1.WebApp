namespace attendance1.Application.Interfaces
{
    public interface IProgrammeService
    {
        Task<Result<GetProgrammeSelectionResponseDto>> GetProgrammeSelectionAsync();
        Task<Result<bool>> CreateNewProgrammeAsync(CreateProgrammeRequestDto requestDto);
        Task<Result<PaginatedResult<GetProgrammeResponseDto>>> GetAllProgrammeAsync(GetProgrammeRequestDto requestDto);
        Task<Result<bool>> EditProgrammeAsync(EditProgrammeRequestDto requestDto);
        Task<Result<bool>> DeleteProgrammeAsync(DeleteRequestDto requestDto);
    }
}