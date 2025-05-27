

using Application.DTOs.Memberships;
using Application.Services.Memberships;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Api.Membership
{
    [ApiController]
    [Route("[controller]")]
    public class MembershipController : ControllerBase
    {
        private readonly IMembershipService _membershipService;
        private readonly ILogger<MembershipController> _logger;

        public MembershipController(IMembershipService membershipService, ILogger<MembershipController> logger)
        {
            _membershipService = membershipService;
            _logger = logger;
        }

        [HttpPost(Name = "CreateMembership")]
        public async Task<IActionResult> CreateMembership([FromBody] MembershipDTOCreate dto)
        {
            try
            {
                await _membershipService.CreateAsync(dto);
                return Ok("Membership created successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in CreateMembership: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet(Name = "GetAllMemberships")]
        public async Task<IActionResult> GetAllMemberships()
        {
            try
            {
                var memberships = await _membershipService.GetAllAsync();
                return Ok(memberships);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetAllMemberships: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}", Name = "GetMembershipById")]
        public async Task<IActionResult> GetMembershipById(string id)
        {
            try
            {
                var membership = await _membershipService.GetByIdAsync(id);
                if (membership == null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Selected membership does not exist."
                    });
                }


                return Ok(membership);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetMembershipById: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut(Name = "UpdateMembership")]
        public async Task<IActionResult> UpdateMembership(string id, [FromBody] MembershipDTOUpdate dto)
        {
            try
            {
                var result = await _membershipService.UpdateMembershipAsync(id, dto);
                if (!result) return NotFound("Membership not found.");

                return Ok("Membership updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in UpdateMembership: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}", Name = "DeleteMembership")]
        public async Task<IActionResult> DeleteMembership(string id)
        {
            try
            {
                var result = await _membershipService.DeleteAsync(id);
                if (!result) return NotFound("Membership not found.");

                return Ok("Membership deleted successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in DeleteMembership: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmMembership([FromBody] ConfirmMembershipDTO dto)
        {
            try
            {
                var user = await _membershipService.GetUserByIdAsync(dto.UserId); 
                if (user == null)
                    return NotFound("User not found.");

                if (user.MembershipId != null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "You already have an active membership. Cancel it before purchasing a new one\""
                    });
                }


                var success = await _membershipService.AssignMembershipToUserAsync(dto.UserId, dto.MembershipId);

                if (!success)
                    return StatusCode(500, "Failed to assign membership.");

                return Ok(new { success = true, message = "Membership confirmed." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error confirming membership.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet("by-user/{userId}", Name = "GetUserMembership")]
        public async Task<IActionResult> GetUserMembership(string userId)
        {
            try
            {
                _logger.LogInformation($"[Controller] Start GetUserMembership for userId: {userId}");

                var membership = await _membershipService.GetUserMembershipAsync(userId);

                if (membership == null)
                {
                    _logger.LogWarning($"[Controller] No membership found for userId: {userId}");
                    return Ok(new
                    {
                        success = false,
                        message = "You have no active membership"
                    });
                }

                _logger.LogInformation($"[Controller] Membership found: {membership.Title} for userId: {userId}");
                return Ok(membership);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[Controller] Exception in GetUserMembership for userId: {userId}");
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpPost("cancel")]
        public async Task<IActionResult> CancelMembership([FromBody] string userId)
        {
            try
            {
                var success = await _membershipService.CancelMembershipAsync(userId);

                if (!success)
                    return NotFound(new { success = false, message = "User not found or no active membership." });

                return Ok(new { success = true, message = "Membership cancelled successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cancelling membership.");
                return StatusCode(500, "Internal server error.");
            }
        }



    }
}
