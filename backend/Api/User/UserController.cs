using Application.DTOs.Users;
using Application.Services.Users;
using Microsoft.AspNetCore.Mvc;
using Application.Services.IUserServices;
using Application.DTOs.Spaces;
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

        [HttpPost(Name = "CreateUser")]
        public async Task<IActionResult> CreateUser([FromBody] UserDTOCreate userDto)
        {
            try
            {
                var response = await _userService.CreateUserAsync(userDto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in CreateUserAsync method: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}", Name = "GetUserById")]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id.ToString());
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

        [HttpPut("{id}", Name = "UpdateUser")]
        public async Task<IActionResult> UpdateSpace(string id, [FromBody] UserDTOUpdate userDto)
        {
            try
            {
                var user = await _userService.UpdateUserAsync(id, userDto);
                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in UpdateUserAsync method : {ex.Message}");
                return StatusCode(500, "Internal server error");
            }

        }

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
