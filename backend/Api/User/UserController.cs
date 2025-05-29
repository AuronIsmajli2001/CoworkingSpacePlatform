using Application.DTOs.Users;
using Application.Services.Users;
using Microsoft.AspNetCore.Mvc;
using Application.Services.IUserServices;
using Application.DTOs.Spaces;
using Microsoft.AspNetCore.Authorization;

namespace Api.Users
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, ILogger<UserController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [Authorize(Roles = "SuperAdmin,Staff")]
        [HttpPost(Name = "CreateUser")]
        public async Task<IActionResult> CreateUser([FromBody] UserDTOCreate userDto)
        {
            try
            {
                var response = await _userService.CreateUserAsync(userDto);
                return Ok("User created successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in CreateUserAsync method: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize(Roles = "SuperAdmin,Staff,User")]
        [HttpGet("{id}", Name = "GetUserById")]
        public async Task<IActionResult> GetUserById(string id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                    return NotFound("User not found.");

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetUserByIdAsync method: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize(Roles = "SuperAdmin,Staff")]
        [HttpGet(Name = "GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetAllUsersAsync method: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpPut("{id}/role", Name = "DeactivateOrUpdateUserRole")]
        public async Task<IActionResult> UpdateRoleUser(string id, [FromBody] UserRoleDtoUpdate userDto)
        {
            try
            {
                var user = await _userService.DeactivateUserOrChangeRole(id, userDto);
                return Ok("Deactivate or UserRole updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in UpdateUserAsync method : {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize(Roles = "SuperAdmin,Staff,User")]
        [HttpPut("{id}", Name = "UpdateUser")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UserDTOUpdate userDto)
        {
            try
            {
                var user = await _userService.UpdateUserAsync(id, userDto);
                return Ok("User updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in UpdateUserAsync method : {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpDelete("{id}", Name = "DeleteUser")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            try
            {
                await _userService.DeleteUserAsync(id.ToString());
                return Ok("User deleted successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in DeleteUserAsync method: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
