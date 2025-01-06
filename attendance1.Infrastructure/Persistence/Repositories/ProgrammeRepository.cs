using attendance1.Application.Common.Logging;
using attendance1.Domain.Entities;
using attendance1.Domain.Interfaces;
using attendance1.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using attendance1.Application.Extensions;

namespace attendance1.Infrastructure.Persistence.Repositories
{
    public class ProgrammeRepository : BaseRepository, IProgrammeRepository
    {
        public ProgrammeRepository(ILogger<ProgrammeRepository> logger, 
            IDbContextFactory<ApplicationDbContext> contextFactory, 
            LogContext logContext)
            : base(logger, contextFactory, logContext)
        {
        }

        public async Task<bool> HasProgrammeExistedAsync(int programmeId)
        {
            var IsExisted = await _database.Programmes
                .AnyAsync(p => p.ProgrammeId == programmeId && p.IsDeleted == false);
            return IsExisted;
        }

        public async Task<int> GetTotalProgrammeAsync()
        {
            var result = await ExecuteGetAsync<object>(async () => 
                await _database.Programmes.CountAsync(p => p.IsDeleted == false));
            return Convert.ToInt32(result ?? 0);
        }

        public async Task<List<Programme>> GetAllProgrammeAsync(int pageNumber = 1, int pageSize = 15)
        {
            return await ExecuteGetAsync(async () => await _database.Programmes
                .Where(p => p.IsDeleted == false)
                .OrderBy(p => p.ProgrammeName)
                .AsNoTracking()
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync());
        }

        public async Task<bool> CreateNewProgrammeAsync(Programme programme)
        {
            await _database.Programmes.AddAsync(programme);
            await _database.SaveChangesAsync();
            return true;
        }

        public async Task<bool> EditProgrammeAsync(Programme programme)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                var programmeToEdit = await _database.Programmes
                    .FirstOrDefaultAsync(p => p.ProgrammeId == programme.ProgrammeId 
                        && p.IsDeleted == false);

                if (programmeToEdit == null)
                    throw new Exception("Programme not found");

                programmeToEdit.ProgrammeName = programme.ProgrammeName;
                await _database.SaveChangesAsync();
                return true;
            });
        }

        public async Task<bool> DeleteProgrammeAsync(int programmeId)
        {
            var programmeToDelete = await _database.Programmes
                .FirstOrDefaultAsync(p => p.ProgrammeId == programmeId 
                    && p.IsDeleted == false);

            if (programmeToDelete == null)
                throw new Exception("Programme not found");

            programmeToDelete.IsDeleted = true;
            await _database.SaveChangesAsync();
            return true;
        }
    }
}
