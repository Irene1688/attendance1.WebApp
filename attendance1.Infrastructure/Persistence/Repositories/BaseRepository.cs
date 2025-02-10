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
        protected readonly IDbContextFactory<ApplicationDbContext> _contextFactory;
        private ApplicationDbContext? _currentDatabase;
        protected ApplicationDbContext _database => _currentDatabase ?? _contextFactory.CreateDbContext();

        public BaseRepository(ILogger<BaseRepository> logger, 
            IDbContextFactory<ApplicationDbContext> contextFactory, 
            LogContext logContext)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _contextFactory = contextFactory ?? throw new ArgumentNullException(nameof(contextFactory));
            _logContext = logContext ?? throw new ArgumentNullException(nameof(logContext));
        }

        // return T
        protected async Task<T> ExecuteGetAsync<T>(
            Func<Task<T?>> action,
            [CallerMemberName] string? methodName = null) 
            where T : class
        {
            try 
            {
                _logger.LogInfoWithContext("Starting repo method...", _logContext.GetUserInfo(), methodName);
                
                var result = await action();
                
                _logger.LogInfoWithContext("Completed repo method", _logContext.GetUserInfo(), methodName);
                
                if (result == null)
                    throw new KeyNotFoundException($"{typeof(T).Name} not found");
                    
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogErrorWithContext($"Error in repo method: {ex.Message}", ex, _logContext.GetUserInfo(), methodName);
                throw;
            }
        } 

        // return struct
        protected async Task<T> ExecuteGetAsync<T>(
            Func<Task<T?>> action,
            [CallerMemberName] string? methodName = null) 
            where T : struct
        {
            try 
            {
                _logger.LogInfoWithContext("Starting repo method...", _logContext.GetUserInfo(), methodName);
                
                var result = await action();
                
                _logger.LogInfoWithContext("Completed repo method", _logContext.GetUserInfo(), methodName);
                
                if (result == null)
                    throw new KeyNotFoundException($"{typeof(T).Name} not found");
                    
                return result.Value;
            }
            catch (Exception ex)
            {
                _logger.LogErrorWithContext($"Error in repo method: {ex.Message}", ex, _logContext.GetUserInfo(), methodName);
                throw;
            }
        }

        // transaction handling
        protected async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return await _database.Database.BeginTransactionAsync();
        }

        protected async Task<T> ExecuteWithTransactionAsync<T>(Func<Task<T>> action, [CallerMemberName] string? methodName = null)
        {
            _currentDatabase = _contextFactory.CreateDbContext();
            // Create a new database context
            //using var dbContext = _contextFactory.CreateDbContext();
            //_currentDatabase = dbContext;
            var strategy = _database.Database.CreateExecutionStrategy();
            
            try 
            {
                return await strategy.ExecuteAsync(async () =>
                {
                    await using var transaction = await _database.Database.BeginTransactionAsync();
                    try
                    {
                        _logger.LogInfoWithContext("Starting repo method: Begin database transaction...", _logContext.GetUserInfo(), methodName);
                        var result = await action();
                        await _database.SaveChangesAsync();
                        await transaction.CommitAsync();
                        _logger.LogInfoWithContext("Completed repo method: Commit database transaction", _logContext.GetUserInfo(), methodName);
                        return result;
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        _logger.LogErrorWithContext("Error in repo method: Failed to commit database transaction. Rolled back.", ex, _logContext.GetUserInfo(), methodName);
                        throw;
                    }
                });
            }
            finally
            {
                // 安全地清理资源
                if (_currentDatabase != null)
                {
                    await _currentDatabase.DisposeAsync();
                    _currentDatabase = null;
                }
            }
        }
    }
}
