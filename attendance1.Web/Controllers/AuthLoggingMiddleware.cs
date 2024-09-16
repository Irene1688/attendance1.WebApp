namespace attendance1.Web.Controllers
{
    public class AuthLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<AuthLoggingMiddleware> _logger;

        public AuthLoggingMiddleware(RequestDelegate next, ILogger<AuthLoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // log related info
            _logger.LogInformation("Request started at {Time}", DateTime.UtcNow);

            await _next(context);

            // log identity status
            if (context.User.Identity.IsAuthenticated)
            {
                _logger.LogInformation("User is authenticated. User: {User}", context.User.Identity.Name);
            }
            else
            {
                _logger.LogWarning("User is not authenticated.");
            }
        }
    }
}
