namespace attendance1.WebApi.Middleware
{
    public class LogContextMiddleware
    {
        private readonly RequestDelegate _next;

        public LogContextMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, LogContext logContext)
        {
            try
            {
                await _next(context);
            }
            finally
            {
                // clean log context for next request
                context.RequestServices.GetService<LogContext>();
            }
        }
    }

    public static class LogContextMiddlewareExtensions
    {
        public static IApplicationBuilder UseLogContext(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<LogContextMiddleware>();
        }
    }
}