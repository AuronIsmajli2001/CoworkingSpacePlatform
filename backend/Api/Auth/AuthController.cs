﻿using Microsoft.AspNetCore.Mvc;
using Domain.Users;
using Application.Services.Auth;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Application.DTOs.Auth;
using Microsoft.IdentityModel.Tokens;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDTO>> Login([FromForm] LoginRequestDTO request)
    {
        try
        {
            var user = await _authService.Authenticate(request.Username, request.Password);

            if (user == null)
            {
                _logger.LogWarning("Failed login attempt for username: {Username}", request.Username);
                return Unauthorized(new ErrorResponseDTO("Invalid username or password"));
            }

            var tokens = await _authService.GenerateTokens(user);

            _logger.LogInformation("User {Username} logged in successfully", user.UserName);

            return Ok(new AuthResponseDTO
            {
                AccessToken = tokens.AccessToken,
                RefreshToken = tokens.RefreshToken,
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for username: {Username}", request.Username);
            return StatusCode(500, new ErrorResponseDTO("An error occurred during login"));
        }
    }

    [HttpPost("signup")]
    public async Task<IActionResult> SignUp([FromForm] SignUpRequestDTO request)
    {
        try
        {
            var newUser = new User
            {
                UserName = request.Username,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Password = request.Password // Will be hashed in AuthService
            };

            var createdUser = await _authService.SignUp(newUser);
            var tokens = await _authService.GenerateTokens(createdUser);

            _logger.LogInformation("New user registered: {Username}", createdUser.UserName);

            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during signup for username: {Username}", request.Username);
            return BadRequest(new ErrorResponseDTO(ex.Message));
        }
    }

    [HttpPost("refresh-token")]
    public async Task<ActionResult<AuthTokens>> RefreshToken([FromBody] RefreshTokenRequestDTO request)
    {
        try
        {
            var tokens = await _authService.RefreshToken(request.AccessToken, request.RefreshToken);
            return Ok(tokens);
        }
        catch (SecurityTokenException ex)
        {
            _logger.LogWarning(ex, "Invalid refresh token attempt");
            return Unauthorized(new ErrorResponseDTO(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token refresh");
            return StatusCode(500, new ErrorResponseDTO("An error occurred while refreshing token"));
        }
    }

    [Authorize]
    [HttpPost("revoke-token")]
    public async Task<IActionResult> RevokeToken([FromBody] RevokeTokenRequestDTO request)
    {
        try
        {
            await _authService.RevokeRefreshToken(request.RefreshToken);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error revoking token");
            return StatusCode(500, new ErrorResponseDTO("Failed to revoke token"));
        }
    }

    [HttpGet("GetCurrentUser")]
    public ActionResult<UserProfileDTO> GetCurrentUser()
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var username = User.FindFirstValue(ClaimTypes.Name);
            var email = User.FindFirstValue(ClaimTypes.Email);
            var role = User.FindFirstValue(ClaimTypes.Role);

            return Ok(new UserProfileDTO
            {
                UserId = userId,
                Username = username,
                Email = email,
                Role = role
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting current user");
            return StatusCode(500, new ErrorResponseDTO("Error retrieving user profile"));
        }
    }
}