using Application.DTOs.Memberships;
using Application.Services.Memberships;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace Api.Memberships
{
    [ApiController]
    [Route("[controller]")]
    public class MembershipsController : ControllerBase
    {
        private readonly IMembershipService _membershipService;
        private readonly ILogger<MembershipsController> _logger;

        public MembershipsController(
            IMembershipService membershipService,
            ILogger<MembershipsController> logger)
        {
            _membershipService = membershipService;
            _logger = logger;
        }

        [HttpPost(Name = "CreateMembership")]
        public async Task<IActionResult> CreateMembership([FromBody] MembershipDTOCreate membershipDto)
        {
            try
            {
                await _membershipService.CreateMembershipAsync(membershipDto);
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
                var memberships = await _membershipService.GetAllMemberships();
                return Ok(memberships);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetAllMemberships: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}