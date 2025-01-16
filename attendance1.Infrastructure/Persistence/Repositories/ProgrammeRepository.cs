using attendance1.Application.Common.Logging;
using attendance1.Domain.Entities;
using attendance1.Domain.Interfaces;
using attendance1.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using attendance1.Application.Extensions;
using System.Linq.Expressions;

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

        public async Task<bool> HasProgrammeNameExistedAsync(string programmeName)
        {
            var IsExisted = await _database.Programmes
                .AnyAsync(p => 
                    EF.Functions.Collate(p.ProgrammeName, "SQL_Latin1_General_CP1_CI_AS") == programmeName && 
                    p.IsDeleted == false);
            return IsExisted;
        }

        public async Task<int> GetTotalProgrammeAsync()
        {
            var result = await ExecuteGetAsync<object>(async () => 
                await _database.Programmes.CountAsync(p => p.IsDeleted == false));
            return Convert.ToInt32(result ?? 0);
        }

        public async Task<List<Programme>> GetAllProgrammeAsync(
            int pageNumber = 1, 
            int pageSize = 15, 
            string searchTerm = "", 
            string orderBy = "programmename", 
            bool isAscending = true)
        {
            var query = _database.Programmes
                .Where(p => p.IsDeleted == false)
                .AsNoTracking();

            if (!string.IsNullOrEmpty(searchTerm)) 
            {
                searchTerm = searchTerm.ToLower();
                query = query.Where(p => 
                    EF.Functions.Collate(p.ProgrammeName, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm));
            }

            if (orderBy == "programmename")
            {
                query = isAscending 
                    ? query.OrderBy(p => p.ProgrammeName) 
                    : query.OrderByDescending(p => p.ProgrammeName);
            }

            return await ExecuteGetAsync(async () => await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync());
        }

        public async Task<bool> CreateNewProgrammeAsync(Programme programme)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                await _database.Programmes.AddAsync(programme);
                await _database.SaveChangesAsync();
                return true;
            });
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
            return await ExecuteWithTransactionAsync(async () =>
            {
                var programmeToDelete = await _database.Programmes
                .FirstOrDefaultAsync(p => p.ProgrammeId == programmeId
                    && p.IsDeleted == false);

                if (programmeToDelete == null)
                    throw new Exception("Programme not found");

                programmeToDelete.IsDeleted = true;
                await _database.SaveChangesAsync();
                return true;
            });
            
        }
    }
}
