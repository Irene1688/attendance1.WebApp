using attendance1.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System.Transactions;
using attendance1.Application.Extensions;
using attendance1.Application.Common.Logging;
using System.Runtime.CompilerServices;

namespace attendance1.Infrastructure.Persistence.Repositories
{
    public abstract class BaseRepository
    {
        protected readonly ILogger<BaseRepository> _logger;
        protected readonly LogContext _logContext;
        //protected readonly ApplicationDbContext _database;
        protected readonly IDbContextFactory<ApplicationDbContext> _contextFactory;
        protected ApplicationDbContext _database => _contextFactory.CreateDbContext();

        public BaseRepository(ILogger<BaseRepository> logger, 
            IDbContextFactory<ApplicationDbContext> contextFactory, 
            LogContext logContext)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _contextFactory = contextFactory ?? throw new ArgumentNullException(nameof(contextFactory));
            _logContext = logContext ?? throw new ArgumentNullException(nameof(logContext));
        }

        // transaction handling
        protected async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return await _database.Database.BeginTransactionAsync();
        }

        protected async Task<T> ExecuteWithTransactionAsync<T>(Func<Task<T>> action, [CallerMemberName] string? methodName = null)
        {
            // var strategy = _database.Database.CreateExecutionStrategy();
            // return await strategy.ExecuteAsync<object?, T>(
            //     state: default,
            //     operation: async (dbContext, _, cancellationToken) =>
            //     {
            //         await using var transaction = await BeginTransactionAsync();
            //         try
            //         {
            //             var result = await action();
            //             await transaction.CommitAsync(cancellationToken);
            //             return result;
            //         }
            //         catch (Exception ex)
            //         {
            //             await transaction.RollbackAsync(cancellationToken);
            //             _logger.LogError(ex, "Transaction failed. Rolled back.");
            //             throw;
            //         }
            //     },
            //     verifySucceeded: null,
            //     cancellationToken: CancellationToken.None
            // );
            var strategy = _database.Database.CreateExecutionStrategy();
                return await strategy.ExecuteAsync<object?, T>(
                    state: default,
                    operation: async (dbContext, _, cancellationToken) =>
                    {
                        using var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
                        try
                        {
                            _logger.LogInfoWithContext("Starting repo method: Begin database transaction", _logContext.GetUserInfo(), methodName);
                            var result = await action();
                            scope.Complete();
                            _logger.LogInfoWithContext("Completed repo method: Commit database transaction", _logContext.GetUserInfo(), methodName);
                            return result;
                        }
                        catch (Exception ex)
                        {
                            _logger.LogErrorWithContext("Error in repo method: Failed to commit database transaction. Rolled back.", ex, _logContext.GetUserInfo(), methodName);
                            throw;
                        }
                    },
                    verifySucceeded: null,
                    cancellationToken: CancellationToken.None
                );
        }


    }
}
