using Application.DTOs.Equipments;
using Application.DTOs.Spaces;
using Application.Services.Equipments;
using Microsoft.AspNetCore.Mvc;

namespace Api.Equipment
{
    [ApiController]
    [Route("[controller]")]
    public class EquipmentController : ControllerBase
    {
        private readonly IEquipmentService _equipmentService;
        private readonly ILogger<EquipmentController> _logger;  

        public EquipmentController(IEquipmentService equipmentService,ILogger<EquipmentController> logger)
        {
            _equipmentService = equipmentService;
            _logger = logger;
        }

        [HttpGet("Hi")]
        public IActionResult getHi()
        {
            return Ok();
        }

        [HttpGet("{id}", Name = "GetEquipmentById")]
        public async Task<IActionResult> GetEquipmentById(string id)
        {
            try
            {
                var equipment = await _equipmentService.GetEquipmentByIdAsync(id);
                if (equipment == null)
                {
                    return NotFound("Equipment not found.");
                }
                return Ok(equipment);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetEquipmentByIdAsync method: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet(Name = "GetAllEquipment")]
        public async Task<IActionResult> GetAllSpaces()
        {
            try
            {
                var equipments = await _equipmentService.GetAllEquipmentAsync();
                return Ok(equipments);

            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetAllSpacesAsync method: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost(Name = "CreateEquipment")]
        public async Task<IActionResult> CreateEquipment([FromForm] EquipmentDTOCreate equipmentDTO)
        {
            try
            {
                var response = await _equipmentService.CreateEquipmentAsync(equipmentDTO);
                return Ok(response);

            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in CreateEquipmentAsync method : {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}", Name = "UpdateEquipment")]
        public async Task<IActionResult> UpdateEquipment(string id, [FromForm] EquipmentDTOUpdate equipmentDto)
        {
            try
            {
                var equipment = await _equipmentService.UpdateEquipmentAsync(id, equipmentDto);
                return Ok(equipment);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in UpdateEquipmentAsync method : {ex.Message}");
                return StatusCode(500, "Internal server error");
            }

        }



        [HttpDelete("{id}", Name = "DeleteEquipment")]
        public async Task<IActionResult> DeleteEquipment(string id)
        {
            try
            {
                await _equipmentService.DeleteEquipmentAsync(id);
                return Ok("Equipment deleted successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in DeletEquipmentAsync method: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
