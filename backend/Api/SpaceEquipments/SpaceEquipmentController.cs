using Application.DTOs.SpaceEquipments;
using Application.Services.SpaceEquipments;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.SpaceController
{
    [ApiController]
    [Route("[controller]")]
    public class SpaceEquipmentController : ControllerBase
    {
        private readonly ISpaceEquipmentService _spaceEquipmentsService;
        private readonly ILogger<SpaceEquipmentController> _logger;

        public SpaceEquipmentController(ISpaceEquipmentService spaceEquipmentService, ILogger<SpaceEquipmentController> logger)
        {
            _spaceEquipmentsService = spaceEquipmentService;
            _logger = logger;
        }

        [Authorize(Roles = "SuperAdmin,Staff")]
        [HttpPost(Name = "CreateSpaceEquipment")]
        public async Task<IActionResult> CreateSpaceEquipment([FromBody] SpaceEquipmentDTOCreate dto)
        {
            try
            {
                await _spaceEquipmentsService.CreateSpaceEquipmentAsync(dto);
                return Ok("SpaceEquipment created successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in CreateSpaceEquipment: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{spaceId}", Name = "GetEquipmentspBySpaceId")]
        public async Task<IActionResult> GetEquipmentsBySpaceId(string spaceId)
        {
            try
            {
                var spaceEquipments = _spaceEquipmentsService.GetEquipmentsBySpaceIdAsync(spaceId);
                return Ok(spaceEquipments);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetEquipmentsBySpaceId: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize(Roles = "SuperAdmin,Staff")]
        [HttpPut(Name = "UpdateSpaceEquipment")]
        public async Task<IActionResult> UpdateSpaceEquipment(string spaceId,string equipmentId, int quantity)
        {
            try
            {
                await _spaceEquipmentsService.UpdateSpaceEquipmentAsync(spaceId,equipmentId,quantity);
                return Ok("SpaceEquipment updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in UpdateSpaceEquipment: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize(Roles = "SuperAdmin,Staff")]
        [HttpDelete(Name = "DeleteSpaceEquipment")]
        public async Task<IActionResult> DeleteSpaceEquipment(string equipmentId,string spaceId)
        {
            try
            {
                await _spaceEquipmentsService.DeleteSpaceEquipmentAsync(equipmentId,spaceId);
                return Ok("SpaceEquipment deleted successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in DeleteSpaceEquipment: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
