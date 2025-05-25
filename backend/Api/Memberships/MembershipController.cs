/*using Application.DTOs.Memberships;
*//*using Application.Services.Memberships;*//*
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Membership
{
    [ApiController]
    [Route("api/[controller]")]
    public class MembershipController : ControllerBase
    {
        private readonly IMembershipService _service;

        public MembershipController(IMembershipService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MembershipDTORead>>> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MembershipDTORead>> GetById(int id)
        {
            var membership = await _service.GetByIdAsync(id);
            if (membership == null) return NotFound();
            return Ok(membership);
        }

        [HttpPost]
        public async Task<ActionResult<MembershipDTORead>> Create(MembershipDTOCreate dto)
        {
            try
            {
                var created = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> Update(MembershipDTOUpdate dto)
        {
            try
            {
                await _service.UpdateAsync(dto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)  // ✅ Accepts strings
        {
            try
            {
                await _service.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}*/

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
                var result = await _membershipService.UpdateMembershipAsync(id,dto);
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
                var user = await _membershipService.GetUserByIdAsync(dto.UserId); // You'll add this below
                if (user == null)
                    return NotFound("User not found.");

                //if (user.MembershipId != null)
                //    return BadRequest("User already has an active membership.");
                if (user.MembershipId != null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "User already has an active membership."
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

    }
}