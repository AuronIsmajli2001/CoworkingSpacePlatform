using Application.Interfaces.IUnitOfWork;
using Domain.Users;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DevOne.Security.Cryptography.BCrypt;
using Microsoft.EntityFrameworkCore;
using Domain.Enums;
using Application.Services.Auth;
using Application.DTOs.Auth;
using System.Security.Cryptography;

public class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;
    private readonly IUnitOfWork _unitOfWork;
    private const int BCRYPT_WORK_FACTOR = 12; 
    private const int REFRESH_TOKEN_LIFETIME_DAYS = 30;

    public AuthService(IConfiguration configuration, IUnitOfWork unitOfWork)
    {
        _configuration = configuration;
        _unitOfWork = unitOfWork;
    }

    public async Task<AuthTokens> GenerateTokens(User user)
    {
        var accessToken = await GenerateAccessToken(user);
        var refreshToken = await CreateRefreshToken(user.Id);

        return new AuthTokens
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken.Token,
            ExpiresIn = Convert.ToInt32(TimeSpan.FromMinutes(
                Convert.ToDouble(_configuration["Jwt:ExpireMinutes"])).TotalSeconds),
            RefreshTokenExpiry = refreshToken.Expires
        };
    }

    private async Task<string> GenerateAccessToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim("userId", user.Id),
            new Claim("name", user.UserName),
            new Claim("email", user.Email),
            new Claim("role", user.Role.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["Jwt:ExpireMinutes"])),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<AuthTokens> RefreshToken(string accessToken, string refreshToken)
    {
        // 1. Validate the expired access token
        var principal = GetPrincipalFromExpiredToken(accessToken);
        var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
            throw new SecurityTokenException("Invalid token claims");

        var userId = userIdClaim.Value;

        // 2. Validate the refresh token
        var storedToken = await _unitOfWork.Repository<RefreshToken>()
            .GetByCondition(rt =>
                rt.Token == refreshToken &&
                rt.UserId == userId &&
                rt.Expires > DateTime.UtcNow &&
                rt.Revoked == null)
            .FirstOrDefaultAsync();

        if (storedToken == null)
            throw new SecurityTokenException("Invalid refresh token");

        // 3. Revoke the old token
        storedToken.Revoked = DateTime.UtcNow;
        _unitOfWork.Repository<RefreshToken>().Update(storedToken);

        // 4. Get user and generate new tokens
        var user = await _unitOfWork.Repository<User>()
            .GetByCondition(u => u.Id == userId)
            .FirstOrDefaultAsync();

        if (user == null)
            throw new SecurityTokenException("User not found");

        // 5. Generate new tokens (this creates a new refresh token)
        var newTokens = await GenerateTokens(user);

        await _unitOfWork.CompleteAsync();

        return newTokens;
    }

    public async Task RevokeRefreshToken(string refreshToken)
    {
        var token = await _unitOfWork.Repository<RefreshToken>()
            .GetByCondition(rt => rt.Token == refreshToken)
            .FirstOrDefaultAsync();

        if (token != null && token.Revoked == null)
        {
            token.Revoked = DateTime.UtcNow;
            _unitOfWork.Repository<RefreshToken>().Update(token);
            await _unitOfWork.CompleteAsync();
        }
    }

    public async Task<User?> Authenticate(string username, string password)
    {
        var user = await _unitOfWork.Repository<User>()
            .GetByCondition(u => u.UserName == username)
            .FirstOrDefaultAsync();

        if (user == null || !user.Active || !BCryptHelper.CheckPassword(password, user.Password))
            return null;

        return user;
    }

    public async Task<User> SignUp(User newUser)
    {
        var userRepo = _unitOfWork.Repository<User>();

        if (await userRepo.GetByCondition(u => u.UserName == newUser.UserName).AnyAsync())
            throw new Exception("Username already exists");

        if (await userRepo.GetByCondition(u => u.Email == newUser.Email).AnyAsync())
            throw new Exception("Email already exists");

        newUser.Password = BCryptHelper.HashPassword(newUser.Password, BCryptHelper.GenerateSalt(BCRYPT_WORK_FACTOR));
        newUser.Created_at = DateTime.UtcNow;
        newUser.Active = true;
        newUser.Role = Role.User;

        userRepo.Create(newUser);
        await _unitOfWork.CompleteAsync();

        return newUser;
    }

    private async Task<RefreshToken> CreateRefreshToken(string userId)
    {
        var refreshToken = new RefreshToken
        {
            Token = GenerateSecureToken(),
            Expires = DateTime.UtcNow.AddDays(REFRESH_TOKEN_LIFETIME_DAYS),
            UserId = userId,
            Created = DateTime.UtcNow
        };

        // Revoke all previous active refresh tokens for this user
        var previousTokens = await _unitOfWork.Repository<RefreshToken>()
            .GetByCondition(rt =>
                rt.UserId == userId &&
                rt.Expires > DateTime.UtcNow &&
                rt.Revoked == null)
            .ToListAsync();

        foreach (var token in previousTokens)
        {
            token.Revoked = DateTime.UtcNow;
            _unitOfWork.Repository<RefreshToken>().Update(token);
        }

        _unitOfWork.Repository<RefreshToken>().Create(refreshToken);
        await _unitOfWork.CompleteAsync();

        return refreshToken;
    }

    private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = true,
            ValidAudience = _configuration["Jwt:Audience"],
            ValidateIssuer = true,
            ValidIssuer = _configuration["Jwt:Issuer"],
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])),
            ValidateLifetime = false // We validate expiration manually
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);

        // Additional validation for algorithm
        if (securityToken is not JwtSecurityToken jwtSecurityToken ||
            !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
        {
            throw new SecurityTokenException("Invalid token");
        }

        return principal;
    }

    private string GenerateSecureToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
    }
}
