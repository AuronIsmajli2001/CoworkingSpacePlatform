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

        // MembershipController.cs
        [ApiController]
        [Route("[controller]")]
        public class MembershipsController : ControllerBase
        {
            private readonly IMembershipService _service;

            public MembershipsController(IMembershipService service)
            {
                _service = service;
            }

            [HttpGet]
            public async Task<IActionResult> GetAll()
            {
                var memberships = await _service.GetAllMemberships();
                return Ok(memberships);
            }

            [HttpPost]
            [Consumes("multipart/form-data")]
            public async Task<IActionResult> Create([FromForm] MembershipCreateDto dto)
            {
                var createdMembership = await _service.CreateMembership(dto);
                return CreatedAtAction(nameof(GetAll), new { id = createdMembership.Id }, createdMembership);
            }

            [HttpPut("{id}")]
            [Consumes("multipart/form-data")]
            public async Task<IActionResult> Update(string id, [FromForm] MembershipUpdateDto dto)
            {
                var updatedMembership = await _service.UpdateMembership(id, dto);
                return Ok(updatedMembership);
            }

            [HttpDelete("{id}")]
            public async Task<IActionResult> Delete(string id)
            {
                await _service.DeleteMembership(id);
                return NoContent();
            }
        }
    }
}