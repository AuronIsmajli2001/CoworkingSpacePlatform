using Application.DTOs.Reservations;
using Application.Services.Reservations;
using Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Api.Reservations
{
    [ApiController]
    [Route("[controller]")]
    public class ReservationsController : ControllerBase
    {
        private readonly IReservationsService _reservationService;
        private readonly ILogger<ReservationsController> _logger;

        public ReservationsController(
            IReservationsService reservationService,
            ILogger<ReservationsController> logger)
        {
            _reservationService = reservationService;
            _logger = logger;
        }

        [HttpPost(Name = "CreateReservation")]
        public async Task<IActionResult> CreateReservation([FromBody] ReservationDTOCreate reservationDto)
        {
            try
            {
                // Add the current timestamp
                reservationDto.Created_at = DateTime.UtcNow;

                // Set default status to "Pending"
                reservationDto.Status = ReservationStatus.Pending;

                await _reservationService.CreateReservationAsync(reservationDto);
                return Ok(new
                {
                    success = true,
                    message = "Reservation created successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in CreateReservation: {ex.Message}");
                return StatusCode(500, new
                {
                    success = false,
                    error = ex.Message
                });
            }
        }
    }
} 