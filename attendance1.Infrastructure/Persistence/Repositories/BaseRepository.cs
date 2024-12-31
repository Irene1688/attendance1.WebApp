using attendance1.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Threading;

namespace attendance1.Infrastructure.Persistence.Repositories
{
    public abstract class BaseRepository
    {
        protected readonly ILogger<BaseRepository> _logger;
        protected readonly ApplicationDbContext _database;

        public BaseRepository(ILogger<BaseRepository> logger, ApplicationDbContext database)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _database = database ?? throw new ArgumentNullException(nameof(database));
        }

        // transaction handling
        protected async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return await _database.Database.BeginTransactionAsync();
        }

        protected async Task<T> ExecuteWithTransactionAsync<T>(Func<Task<T>> action)
        {
            var strategy = _database.Database.CreateExecutionStrategy();
            return await strategy.ExecuteAsync<object?, T>(
                state: default,
                operation: async (dbContext, _, cancellationToken) =>
                {
                    await using var transaction = await BeginTransactionAsync();
                    try
                    {
                        var result = await action();
                        await transaction.CommitAsync(cancellationToken);
                        return result;
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync(cancellationToken);
                        _logger.LogError(ex, "Transaction failed. Rolled back.");
                        throw;
                    }
                },
                verifySucceeded: null,
                cancellationToken: CancellationToken.None
            );
        }
    }
}
