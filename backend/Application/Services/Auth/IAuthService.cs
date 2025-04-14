using Application.DTOs.Auth;
using Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.Auth
{
    public interface IAuthService
    {
        Task<AuthTokens> GenerateTokens(User user);  // Changed return type
        Task<User?> Authenticate(string username, string password);
        Task<User> SignUp(User newUser);
        Task<AuthTokens> RefreshToken(string accessToken, string refreshToken);
        Task RevokeRefreshToken(string refreshToken);
    }
}
