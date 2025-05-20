// Api/Controllers/DashboardController.cs
using Application.DTOs.Dashboard;
using Application.Services.IUserServices;
using Application.Services.Users;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/dashboard")]

    public class DashboardController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(
            IUserService userService,
            ILogger<DashboardController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpGet("user-stats")]
        public async Task<IActionResult> GetUserStats()
        {
            try
            {
                var stats = await _userService.GetUserStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting user stats: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}