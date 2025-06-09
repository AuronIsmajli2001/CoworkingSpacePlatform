using Application.DTOs.Reservations;
using Application.Services.Reservations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace Api.Reservations
{
    [ApiController]
    [Route("[controller]")]
    public class ReservationController : ControllerBase
    {
        private readonly IReservationsService _reservationService;
        private readonly ILogger<ReservationController> _logger;

        public ReservationController(IReservationsService reservationService, ILogger<ReservationController> logger)
        {
            _reservationService = reservationService;
            _logger = logger;
        }

        [Authorize]
        [HttpPost(Name = "CreateReservation")]
        public async Task<IActionResult> CreateReservation([FromBody] ReservationDTOCreate dto)
        {
            try
            {
                await _reservationService.CreateReservationAsync(dto);
                return Ok("Reservation created successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in CreateReservation: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
        [Authorize(Roles = "SuperAdmin,Staff")]
        [HttpGet(Name = "GetAllReservations")]
        public async Task<IActionResult> GetAllReservations()
        {
            try
            {
                var reservations = await _reservationService.GetAllReservationsAsync();
                return Ok(reservations);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetAllReservations: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize]
        [HttpGet("{id}", Name = "GetReservationById")]
        public async Task<IActionResult> GetReservationById(string id)
        {
            try
            {
                var reservation = await _reservationService.GetReservationByIdAsync(id);
                if (reservation == null) return NotFound("Reservation not found.");

                return Ok(reservation);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetReservationById: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize]
        [HttpPut("{id}", Name = "UpdateReservation")]
        public async Task<IActionResult> UpdateReservation(string id, [FromBody] ReservationDTOUpdate dto)
        {
            try
            {
                var result = await _reservationService.UpdateReservationAsync(id, dto);
                if (result == null) return NotFound("Reservation not found.");

                return Ok("Reservation updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in UpdateReservation: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize]
        [HttpPost("cancel/{id}")]
        public async Task<IActionResult> CancelReservation(string id)
        {
            try
            {
                var result = await _reservationService.CancelReservationAsync(id);
                if (!result) return NotFound("Reservation not found or already cancelled.");

                return Ok("Reservation cancelled successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in CancelReservation: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }


        [Authorize]
        [HttpDelete("{id}", Name = "DeleteReservation")]
        public async Task<IActionResult> DeleteReservation(string id)
        {
            try
            {
                var result = await _reservationService.DeleteReservationAsync(id);
                if (!result) return NotFound("Reservation not found.");

                return Ok("Reservation deleted successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in DeleteReservation: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("by-user/{userId}")]
        public async Task<IActionResult> GetReservationsByUser(string userId)
        {
            var reservations = await _reservationService.GetReservationsByUserIdAsync(userId);

            if (reservations == null || !reservations.Any())
            {
                return Ok(new
                {
                    success = false,
                    message = "No reservations found for this user.",
                });
            }

            return Ok(new { success = true, reservations });
        }
    }
}



