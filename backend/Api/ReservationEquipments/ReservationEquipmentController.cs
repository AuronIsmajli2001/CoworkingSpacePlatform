using Application.DTOs.ReservationEquipments;
using Application.Services.ReservationEquipments;
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

        [HttpPost(Name = "CreateReservationEquipment")]
        public async Task<IActionResult> CreateReservationEquipment([FromBody] ReservationEquipmentDTOCreate dto)
        {
            try
            {
                await _reservationEquipmentService.CreateReservationEquipmentAsync(dto);
                return Ok("Reservation created successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in CreateReservation: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
