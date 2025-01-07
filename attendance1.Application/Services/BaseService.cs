using attendance1.Application.Common.Logging;
using attendance1.Application.Common.Response;
using Microsoft.Extensions.Logging;
using System.Runtime.CompilerServices;
using attendance1.Application.Extensions;
using System.Net;

namespace attendance1.Application.Services
{
    public abstract class BaseService
    {
        private readonly ILogger<BaseService> _logger;
        private readonly LogContext _logContext;

        public BaseService(ILogger<BaseService> logger, LogContext logContext)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _logContext = logContext ?? throw new ArgumentNullException(nameof(logContext));
        }

        // private string FormatLogMessage(string message, string? methodName)
        // {
        //     var timestamp = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff");
            
        //     var methodInfo = !string.IsNullOrEmpty(methodName) 
        //         ? $"[Method: {methodName}]" 
        //         : string.Empty;
            
        //     var userInfo = !string.IsNullOrEmpty(_logContext.GetUserInfo()) 
        //         ? $"[User: {_logContext.GetUserInfo()}]" 
        //         : string.Empty;
        //     return $"{timestamp} | {userInfo} in {methodInfo} : {message}";
        // }

        protected async Task<Result<T>> ExecuteAsync<T>(Func<Task<T>> action, 
            string errorMessage, 
            [CallerMemberName] string? methodName = null,
            string? loginUserInfo = null)
        {
            try
            {
                var userInfo = methodName?.Contains("Login") == true 
                    ? loginUserInfo 
                    : _logContext.GetUserInfo();
                _logger.LogInfoWithContext($"Service method: {methodName} Started...", userInfo, methodName);
                var result = await action();
                if (result == null)
                    return Result<T>.FailureResult(errorMessage, HttpStatusCode.NotFound);
                _logger.LogInfoWithContext($"Service method: {methodName} Completed", userInfo, methodName);
                return Result<T>.SuccessResult(result);
            }
            catch (Exception ex)
            {
                LogError($"Service method: {methodName} Failed", ex, methodName);
                var statusCode = ex switch
                {
                    UnauthorizedAccessException => HttpStatusCode.Unauthorized,
                    ArgumentException => HttpStatusCode.BadRequest,
                    InvalidOperationException => HttpStatusCode.BadRequest,
                    KeyNotFoundException => HttpStatusCode.NotFound,
                    _ => HttpStatusCode.InternalServerError
                };
                return Result<T>.FailureResult($"{errorMessage}: {ex.Message}", statusCode);
            }
        }

        protected void LogInfo(string message, [CallerMemberName] string? methodName = null)
        {
            _logger.LogInfoWithContext(message, _logContext.GetUserInfo(), methodName);
        }

        protected void LogWarning(string message, [CallerMemberName] string? methodName = null)
        {
            _logger.LogWarningWithContext(message, _logContext.GetUserInfo(), methodName);
        }

        protected void LogError(string message, Exception? ex = null, [CallerMemberName] string? methodName = null)
        {
            _logger.LogErrorWithContext(message, ex, _logContext.GetUserInfo(), methodName);
        }

        protected void LogDebug(string message, [CallerMemberName] string? methodName = null)
        {
            _logger.LogDebugWithContext(message, _logContext.GetUserInfo(), methodName);
        }

        // protected void LogInfo(string message, [CallerMemberName] string? methodName = null)
        // {
        //     var logMessage = FormatLogMessage(message, methodName);
        //     _logger.LogInformation(logMessage);
        // }

        // protected void LogWarning(string message, [CallerMemberName] string? methodName = null)
        // {
        //     var logMessage = FormatLogMessage(message, methodName);
        //     _logger.LogWarning(logMessage);
        // }

        // protected void LogError(string message, Exception? ex = null, [CallerMemberName] string? methodName = null)
        // {
        //     var logMessage = FormatLogMessage(message, methodName);
        //     if (ex != null)
        //     {
        //         _logger.LogError(ex, logMessage);
        //     }
        //     else
        //     {
        //         _logger.LogError(logMessage);
        //     }
        // }

        // protected void LogDebug(string message, [CallerMemberName] string? methodName = null)
        // {
        //     var logMessage = FormatLogMessage(message, methodName);
        //     _logger.LogDebug(logMessage);
        // }

    }

}
