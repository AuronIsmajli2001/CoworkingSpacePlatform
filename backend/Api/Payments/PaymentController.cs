using Application.DTOs.Payments;
using Application.DTOs.Reservations;
using Application.Services.Payments;
using Domain.Payments;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Payments
{
    [ApiController]
    [Route("[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger<PaymentController> _logger;

        public PaymentController(IPaymentService paymentService, ILogger<PaymentController> logger)
        {
            _paymentService = paymentService;
            _logger = logger;
        }

        [Authorize]
        [HttpPost(Name = "CreatePayment")]
        public async Task<IActionResult> CreatePayment([FromBody] PaymentDTOCreate dto)
        {
            try
            {
                await _paymentService.CreatePaymentAsync(dto);
                return Ok("Payment created successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in CreatePayment: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
        [Authorize(Roles = "SuperAdmin")]
        [HttpGet(Name = "GetAllPayments")]
        public async Task<IActionResult> GetAllReservations()
        {
            try
            {
                var payments = await _paymentService.GetAllPaymentsAsync();
                return Ok(payments);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetAllPayments: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpGet("{id}", Name = "GetPaymentById")]
        public async Task<IActionResult> GetPaymentById(string id)
        {
            try
            {
                var payment = await _paymentService.GetPaymentByIdAsync(id);
                if (payment == null) return NotFound("Payment not found.");

                return Ok(payment);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetPaymentById: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize(Roles = "SuperAdmin,Staff")]
        [HttpPut("{id}", Name = "UpdatePayment")]
        public async Task<IActionResult> UpdateReservation(string id, [FromBody] PaymentDTOUpdate dto)
        {
            try
            {
                var result = await _paymentService.UpdatePaymentAsync(id, dto);
                if (result == null)
                {
                    return NotFound("Payment not found.");
                }

                return Ok("Payment updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in UpdatePayment: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpDelete("{id}", Name = "DeletePayment")]
        public async Task<IActionResult> DeletePayment(string id)
        {
            try
            {
                var result = await _paymentService.DeletePaymentAsync(id);
                if (result == null)
                {
                    return NotFound("Payment not found.");
                }

                return Ok("Payment deleted successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in DeletePayment: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
