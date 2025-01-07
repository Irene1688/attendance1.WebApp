using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace attendance1.Application.Common.Logging
{
    public class LogContext
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LogContext(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string? GetUserInfo()
        {
            var user = _httpContextAccessor.HttpContext?.User;

            if (user?.Identity?.IsAuthenticated != true)
                return "User haven't completed login - Anonymous";

            var name = user.Identity.Name;
            var role = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
            var CampusId = user.Claims.Skip(1).FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            return $"({role}) {CampusId} - {name}";
        }
    
    }
}