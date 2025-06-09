using Application.DTOs.Payments;
using Application.Interfaces.IUnitOfWork;
using Domain.Enums;
using Domain.Payments;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

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

        public async Task<string> CreatePaymentAsync(PaymentDTOCreate dto)
        {
            try
            {
                var status = Status.Approved;
                if(dto.PaymentMethod == PaymentMethod.Cash)
                {
                    status = Status.Pending;
                }

                var payment = new Payment
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId = dto.UserId,
                    ReservationId = dto.ReservationId,
                    MembershipId = dto.MembershipId,
                    PaymentMethod = dto.PaymentMethod,
                    CreatedAt = DateTime.UtcNow,
                    Status = status,
                };
                _unitOfWork.Repository<Payment>().Create(payment);
                await _unitOfWork.CompleteAsync();
                _logger.LogInformation("Payment created successfully with ID: {Id}", payment.Id);
                return "Payment created successfully!";
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while creating payment!");
                throw new Exception("Database error!" + dbEx.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while creating payment!");
                throw;
            }
        }

        public async Task<string> DeletePaymentAsync(string id)
        {
            try
            {
                var payment = await _unitOfWork.Repository<Payment>().GetByIdAsync(id);

                if (payment == null)
                {
                    throw new Exception("This Payment does not exist");
                }

                _unitOfWork.Repository<Payment>().Delete(payment);
                await _unitOfWork.CompleteAsync();
                return ("Payment deleted successfully!");
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while deleting Payment with ID: {Id} !", id);
                throw new Exception(dbEx.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while deleting Payment with ID: {Id}", id);
                throw;
            }
        }

        public async Task<List<PaymentDTORead>> GetAllPaymentsAsync()
        {
            try
            {
                var payments = await _unitOfWork.Repository<Payment>().GetAllAsync();

                var paymentsDTOs = payments.Select(dto => new PaymentDTORead
                {
                    Id = dto.Id,
                    UserId = dto.UserId,
                    ReservationId = dto.ReservationId,
                    MembershipId = dto.MembershipId,
                    PaymentMethod = dto.PaymentMethod,
                    CreatedAt = dto.CreatedAt,
                }).ToList();

                _logger.LogInformation("Successfully fetched {Count} Payments from the database.", paymentsDTOs.Count);

                return paymentsDTOs;
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while retrieving all Payments.");
                throw new Exception(dbEx.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving all Payments.");
                throw;
            }
        }

        public async Task<PaymentDTORead> GetPaymentByIdAsync(string id)
        {
            try
            {
                _logger.LogInformation("Fetching Payment with ID: {Id}", id);

                var payment = await _unitOfWork.Repository<Payment>().GetByIdAsync(id);

                if (payment == null)
                {
                    _logger.LogWarning("Payment with ID {Id} not found.", id);
                    return null;
                }

                _logger.LogInformation("Successfully fetched Payment with ID: {Id}", id);

                return new PaymentDTORead
                {
                    Id = payment.Id,
                    UserId = payment.UserId,
                    ReservationId = payment.ReservationId,
                    MembershipId = payment.MembershipId,
                    PaymentMethod = payment.PaymentMethod,
                    CreatedAt = payment.CreatedAt,

                };
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while retrieving space with ID: {Id} !", id);
                throw new Exception(dbEx.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while fetching space with ID: {Id}", id);
                throw;
            }
        }

        public async Task<string> UpdatePaymentAsync(string id, PaymentDTOUpdate dto)
        {
            try
            {
                _logger.LogInformation("Updating Payment with ID: {Id}", id);

                var payment = await _unitOfWork.Repository<Payment>().GetByIdAsync(id);

                if (payment == null)
                {
                    _logger.LogWarning("Cannot update. Payment with ID {Id} not found.", id);
                    return null;
                }

                if (dto.PaymentMethod == null)
                {
                    dto.PaymentMethod = payment.PaymentMethod;
                }

                payment.PaymentMethod = dto.PaymentMethod;

                _unitOfWork.Repository<Payment>().Update(payment);
                await _unitOfWork.CompleteAsync();

                _logger.LogInformation("Successfully updated space with ID: {Id}", id);

                return ("Payment updated successfully!");
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while updating space with ID: {Id} !", id);
                throw new Exception(dbEx.Message);
            }

            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while updating space with ID: {Id}", id);
                throw;
            }
        }

    }
}