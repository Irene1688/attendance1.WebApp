using attendance1.Domain.Entities;

namespace attendance1.Domain.Interfaces
{
    public interface IProgrammeRepository
    {
        Task<bool> HasProgrammeExistedAsync(int programmeId);
        Task<int> GetTotalProgrammeAsync();
        Task<List<Programme>> GetAllProgrammeAsync(int pageNumber = 1, int pageSize = 15);
        Task<bool> CreateNewProgrammeAsync(Programme programme);
        Task<bool> EditProgrammeAsync(Programme programme);
        Task<bool> DeleteProgrammeAsync(int programmeId);
    }
}
