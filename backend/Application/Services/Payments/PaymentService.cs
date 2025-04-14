/*using Application.DTOs.Payments;
using Application.Interfaces.IUnitOfWork;
using Domain.Payments;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.Payments
{
    public class PaymentService : IPaymentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<PaymentService> _logger;

        public PaymentService(IUnitOfWork unitOfWork, ILogger<PaymentService> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        // Create a new payment
        public async Task CreatePaymentAsync(PaymentDTOCreate paymentDTO)
        {
            try
            {
                _logger.LogInformation("Creating a new payment for Reservation ID: {ReservationId} by User ID: {UserId}", paymentDTO.ReservationId, paymentDTO.UserId);

                var payment = new Payment
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId = paymentDTO.UserId,
                    ReservationId = paymentDTO.ReservationId,
                    Status = paymentDTO.Status,
                    PaymentMethod = paymentDTO.PaymentMethod
                };

                _unitOfWork.Repository<Payment>().Create(payment);
                await _unitOfWork.CompleteAsync();
                _logger.LogInformation("Payment created successfully with ID: {PaymentId}", payment.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating payment.");
                throw;
            }
        }

        // Get a payment by ID
        public async Task<PaymentDTORead> GetPaymentByIdAsync(string id)
        {
            try
            {
                _logger.LogInformation("Fetching payment with ID: {PaymentId}", id);

                var payment = await _unitOfWork.Repository<Payment>().GetById(id).FirstOrDefaultAsync();

                if (payment == null)
                {
                    _logger.LogWarning("Payment with ID: {PaymentId} not found", id);
                    return null;
                }

                _logger.LogInformation("Successfully fetched payment with ID: {PaymentId}", id);

                return new PaymentDTORead
                {
                    Id = payment.Id,
                    UserId = payment.UserId,
                    ReservationId = payment.ReservationId,
                    Status = payment.Status,
                    PaymentMethod = payment.PaymentMethod
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching payment with ID: {PaymentId}", id);
                throw;
            }
        }

        // Get all payments
        public async Task<IEnumerable<PaymentDTORead>> GetAllPaymentsAsync()
        {
            try
            {
                _logger.LogInformation("Fetching all payments");

                var payments = await _unitOfWork.Repository<Payment>().GetAllAsync();

                var paymentDTOs = payments.Select(p => new PaymentDTORead
                {
                    Id = p.Id,
                    UserId = p.UserId,
                    ReservationId = p.ReservationId,
                    Status = p.Status,
                    PaymentMethod = p.PaymentMethod
                }).ToList();

                _logger.LogInformation("Successfully fetched {Count} payments", paymentDTOs.Count);
                return paymentDTOs;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching all payments.");
                throw;
            }
        }

        // Update an existing payment
        public async Task<PaymentDTORead> UpdatePaymentAsync(PaymentDTOUpdate paymentDTOUpdate)
        {
            try
            {
                _logger.LogInformation("Updating payment with ID: {PaymentId}", paymentDTOUpdate.Id);

                var payment = await _unitOfWork.Repository<Payment>().GetById(paymentDTOUpdate.Id).FirstOrDefaultAsync();

                if (payment == null)
                {
                    _logger.LogWarning("Cannot update. Payment with ID: {PaymentId} not found.", paymentDTOUpdate.Id);
                    return null;
                }

                // Update the payment status and method
                payment.Status = paymentDTOUpdate.Status ?? payment.Status;
                payment.PaymentMethod = paymentDTOUpdate.PaymentMethod ?? payment.PaymentMethod;

                _unitOfWork.Repository<Payment>().Update(payment);
                await _unitOfWork.CompleteAsync();

                _logger.LogInformation("Payment with ID: {PaymentId} updated successfully", paymentDTOUpdate.Id);

                return new PaymentDTORead
                {
                    Id = payment.Id,
                    UserId = payment.UserId,
                    ReservationId = payment.ReservationId,
                    Status = payment.Status,
                    PaymentMethod = payment.PaymentMethod
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating payment with ID: {PaymentId}", paymentDTOUpdate.Id);
                throw;
            }
        }

        public Task<PaymentDTORead> GetPaymentById(string id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<PaymentDTORead>> GetAllPayments()
        {
            throw new NotImplementedException();
        }

        Task<Payment> IPaymentService.UpdatePaymentAsync(PaymentDTOUpdate paymentDTOUpdate)
        {
            throw new NotImplementedException();
        }
    }
}
*/