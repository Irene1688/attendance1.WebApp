using Microsoft.Extensions.Logging;
using System.Runtime.CompilerServices;

namespace attendance1.Application.Extensions
{
    public static class LoggingExtensions
    {
        public static string FormatLogMessage(this ILogger logger, string message, string? userInfo = null, [CallerMemberName] string? methodName = null)
        {
            var timestamp = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff");
            var methodInfo = !string.IsNullOrEmpty(methodName) 
                ? $"[Method: {methodName}]" 
                : string.Empty;
            var user = !string.IsNullOrEmpty(userInfo) 
                ? $"[User: {userInfo}]" 
                : string.Empty;
            return $"{timestamp} | {user} in {methodInfo} : {message}";
        }

        public static void LogInfoWithContext(this ILogger logger, string message, string? userInfo = null, [CallerMemberName] string? methodName = null)
        {
            var logMessage = logger.FormatLogMessage(message, userInfo, methodName);
            logger.LogInformation(logMessage);
        }

        public static void LogWarningWithContext(this ILogger logger, string message, string? userInfo = null, [CallerMemberName] string? methodName = null)
        {
            var logMessage = logger.FormatLogMessage(message, userInfo, methodName);
            logger.LogWarning(logMessage);
        }

        public static void LogErrorWithContext(this ILogger logger, string message, Exception? ex = null, string? userInfo = null, [CallerMemberName] string? methodName = null)
        {
            var logMessage = logger.FormatLogMessage(message, userInfo, methodName);
            if (ex != null)
            {
                logger.LogError(ex, logMessage);
            }
            else
            {
                logger.LogError(logMessage);
            }
        }

        public static void LogDebugWithContext(this ILogger logger, string message, string? userInfo = null, [CallerMemberName] string? methodName = null)
        {
            var logMessage = logger.FormatLogMessage(message, userInfo, methodName);
            logger.LogDebug(logMessage);
        }
    }
}