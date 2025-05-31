using Application.DTOs.ReservationEquipments;
using Application.Services.ReservationEquipments;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.ReservationEquipments
{
    [ApiController]
    [Route("[controller]")]
    public class ReservationEquipmentController : ControllerBase
    {
        private readonly IReservationEquipmentService _reservationEquipmentService;
        private readonly ILogger<ReservationEquipmentController> _logger;
    
        public ReservationEquipmentController(IReservationEquipmentService reservationEquipmentService,ILogger<ReservationEquipmentController> logger)
        {
            _reservationEquipmentService = reservationEquipmentService;
            _logger = logger;
        }

        [Authorize]
        [HttpPost(Name = "CreateReservationEquipment")]
        public async Task<IActionResult> CreateReservationEquipment([FromBody] ReservationEquipmentDTOCreate dto)
        {
            try
            {
                await _reservationEquipmentService.CreateReservationEquipmentAsync(dto);
                return Ok("ReservationEquipment created successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in CreateReservation: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize]
        [HttpGet("{reservationId}", Name = "GetEquipmentspByReservationId")]
        public async Task<IActionResult> GetReservationBySpaceId(string reservationId)
        {
            try
            {
                var reservationEquipments = await _reservationEquipmentService.GetEquipmentsByReservationIdAsync(reservationId);
                return Ok(reservationEquipments);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetReservationBySpaceId: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize]
        [HttpPut(Name = "UpdateReservationEquipment")]
        public async Task<IActionResult> UpdateReservationEquipment(string reservationId, string equipmentId, int quantity)
        {
            try
            {
                await _reservationEquipmentService.UpdateReservationEquipmentAsync(reservationId, equipmentId, quantity);
                return Ok("ReservationEquipment updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in UpdateReservationEquipment: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize]
        [HttpDelete(Name = "DeleteReservationEquipment")]
        public async Task<IActionResult> DeleteReservationEquipment(string reservationId, string spaceId)
        {
            try
            {
                await _reservationEquipmentService.DeleteReservationEquipmentAsync(reservationId, spaceId);
                return Ok("ReservationEquipment deleted successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in DeleteReservationEquipments: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

    }
}
