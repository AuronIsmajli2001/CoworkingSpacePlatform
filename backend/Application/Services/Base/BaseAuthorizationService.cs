using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Application.Services.Auth;

namespace Application.Services.Base
{
    public abstract class BaseAuthorizationService
    {
        protected readonly IAuthService _authService;
        protected readonly IHttpContextAccessor _httpContextAccessor;

        protected BaseAuthorizationService(IAuthService authService, IHttpContextAccessor httpContextAccessor)
        {
            _authService = authService;
            _httpContextAccessor = httpContextAccessor;
        }

        protected ClaimsPrincipal GetCurrentUser()
        {
            return _httpContextAccessor.HttpContext?.User;
        }

        protected bool IsAuthorized(params string[] allowedRoles)
        {
            var user = GetCurrentUser();
            if (user == null || !user.Identity.IsAuthenticated)
                return false;

            if (allowedRoles == null || !allowedRoles.Any())
                return true;

            var userRole = user.FindFirst(ClaimTypes.Role)?.Value;
            return !string.IsNullOrEmpty(userRole) && allowedRoles.Contains(userRole);
        }

        protected void EnsureAuthorized(params string[] allowedRoles)
        {
            if (!IsAuthorized(allowedRoles))
            {
                throw new UnauthorizedAccessException("You are not authorized to perform this action");
            }
        }
    }
} 