//using Application.DTOs.Payments;
//using Application.Interfaces.IUnitOfWork;
//using Domain.Payments;
//using Microsoft.Extensions.Logging;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using Microsoft.EntityFrameworkCore;

//namespace Application.Services.Payments
//{
//    public class PaymentService : IPaymentService
//    {
//        private readonly IUnitOfWork _unitOfWork;
//        private readonly ILogger<PaymentService> _logger;

//        public PaymentService(IUnitOfWork unitOfWork, ILogger<PaymentService> logger)
//        {
//            _unitOfWork = unitOfWork;
//            _logger = logger;
//        }

//        // Create a new payment
//        public async Task CreatePaymentAsync(PaymentDTOCreate paymentDTO)
//        {
//            try
//            {
//                _logger.LogInformation("Creating a new payment for Reservation ID: {ReservationId} by User ID: {UserId}", paymentDTO.ReservationId, paymentDTO.UserId);

//                var payment = new Payment
//                {
//                    Id = Guid.NewGuid().ToString(),
//                    UserId = paymentDTO.UserId,
//                    MembershipId = paymentDTO.MembershipId, 
//                    ReservationId = paymentDTO.ReservationId,                
//                    PaymentMethod = paymentDTO.PaymentMethod
//                };

//                _unitOfWork.Repository<Payment>().Create(payment);
//                await _unitOfWork.CompleteAsync();
//                _logger.LogInformation("Payment created successfully with ID: {PaymentId}", payment.Id);
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error occurred while creating payment.");
//                throw;
//            }
//        }

//        // Get a payment by ID
//        public async Task<PaymentDTORead> GetPaymentByIdAsync(string id)
//        {
//            try
//            {
//                _logger.LogInformation("Fetching payment with ID: {PaymentId}", id);

//                var payment = await _unitOfWork.Repository<Payment>().GetById(id).FirstOrDefaultAsync();

//                if (payment == null)
//                {
//                    _logger.LogWarning("Payment with ID: {PaymentId} not found", id);
//                    return null;
//                }

//                _logger.LogInformation("Successfully fetched payment with ID: {PaymentId}", id);

//                return new PaymentDTORead
//                {
//                    Id = payment.Id,
//                    UserId = payment.UserId,
//                    ReservationId = payment.ReservationId,
//                    Status = payment.Status,
//                    PaymentMethod = payment.PaymentMethod
//                };
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error occurred while fetching payment with ID: {PaymentId}", id);
//                throw;
//            }
//        }

//        // Get all payments
//        public async Task<IEnumerable<PaymentDTORead>> GetAllPaymentsAsync()
//        {
//            try
//            {
//                _logger.LogInformation("Fetching all payments");

//                var payments = await _unitOfWork.Repository<Payment>().GetAllAsync();

//                var paymentDTOs = payments.Select(p => new PaymentDTORead
//                {
//                    Id = p.Id,
//                    UserId = p.UserId,
//                    ReservationId = p.ReservationId,
//                    Status = p.Status,
//                    PaymentMethod = p.PaymentMethod
//                }).ToList();

//                _logger.LogInformation("Successfully fetched {Count} payments", paymentDTOs.Count);
//                return paymentDTOs;
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error occurred while fetching all payments.");
//                throw;
//            }
//        }

//        // Update an existing payment
//        public async Task<PaymentDTORead> UpdatePaymentAsync(PaymentDTOUpdate paymentDTOUpdate)
//        {
//            try
//            {
//                _logger.LogInformation("Updating payment with ID: {PaymentId}", paymentDTOUpdate.Id);

//                var payment = await _unitOfWork.Repository<Payment>().GetById(paymentDTOUpdate.Id).FirstOrDefaultAsync();

//                if (payment == null)
//                {
//                    _logger.LogWarning("Cannot update. Payment with ID: {PaymentId} not found.", paymentDTOUpdate.Id);
//                    return null;
//                }

//                // Update the payment status and method
//                payment.Status = paymentDTOUpdate.Status ?? payment.Status;
//                payment.PaymentMethod = paymentDTOUpdate.PaymentMethod ?? payment.PaymentMethod;

//                _unitOfWork.Repository<Payment>().Update(payment);
//                await _unitOfWork.CompleteAsync();

//                _logger.LogInformation("Payment with ID: {PaymentId} updated successfully", paymentDTOUpdate.Id);

//                return new PaymentDTORead
//                {
//                    Id = payment.Id,
//                    UserId = payment.UserId,
//                    ReservationId = payment.ReservationId,
//                    Status = payment.Status,
//                    PaymentMethod = payment.PaymentMethod
//                };
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error occurred while updating payment with ID: {PaymentId}", paymentDTOUpdate.Id);
//                throw;
//            }
//        }

//        public Task<PaymentDTORead> GetPaymentById(string id)
//        {
//            throw new NotImplementedException();
//        }

//        public Task<IEnumerable<PaymentDTORead>> GetAllPayments()
//        {
//            throw new NotImplementedException();
//        }

//        Task<Payment> IPaymentService.UpdatePaymentAsync(PaymentDTOUpdate paymentDTOUpdate)
//        {
//            throw new NotImplementedException();
//        }
//    }
//}using Application.DTOs.Payments;


using Application.DTOs.Payments;
using Application.Interfaces.IUnitOfWork;
using Domain.Payments;
using Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

        public async Task CreatePaymentAsync(PaymentDTOCreate paymentDTO)
        {
            try
            {
                _logger.LogInformation("Creating payment for User {UserId}", paymentDTO.UserId);

                // Validate the payment first
                if (string.IsNullOrEmpty(paymentDTO.UserId))
                    throw new ArgumentException("User ID is required");

                if (string.IsNullOrEmpty(paymentDTO.ReservationId) && string.IsNullOrEmpty(paymentDTO.MembershipId))
                    throw new ArgumentException("Either ReservationID or MembershipID must be provided");

                // Create the payment record
                var payment = new Payment
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId = paymentDTO.UserId,
                    ReservationId = paymentDTO.ReservationId,
                    MembershipId = paymentDTO.MembershipId,
                    PaymentMethod = paymentDTO.PaymentMethod
                };

                _unitOfWork.Repository<Payment>().Create(payment);
                await _unitOfWork.CompleteAsync();

                _logger.LogInformation("Payment {PaymentId} created successfully", payment.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create payment");
                throw;
            }
        }

        public async Task<PaymentDTORead> GetPaymentById(string id)
        {
            try
            {
                var payment = await _unitOfWork.Repository<Payment>()
                    .GetByIdAsync(id); // Using GetByIdAsync directly

                if (payment == null)
                    return null;

                return new PaymentDTORead
                {
                    Id = payment.Id,
                    UserId = payment.UserId,
                    ReservationId = payment.ReservationId,
                    MembershipId = payment.MembershipId,
                    PaymentMethod = payment.PaymentMethod
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payment {PaymentId}", id);
                throw;
            }
        }

        public async Task<IEnumerable<PaymentDTORead>> GetAllPayments()
        {
            try
            {
                var payments = await _unitOfWork.Repository<Payment>()
                    .GetAllAsync();

                return payments.Select(p => new PaymentDTORead
                {
                    Id = p.Id,
                    UserId = p.UserId,
                    ReservationId = p.ReservationId,
                    MembershipId = p.MembershipId,
                    PaymentMethod = p.PaymentMethod
                }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payments");
                throw;
            }
        }

        public async Task<Payment> UpdatePaymentAsync(PaymentDTOUpdate paymentDTOUpdate)
        {
            try
            {
                _logger.LogInformation("Updating payment with ID: {PaymentId}", paymentDTOUpdate.Id);

                var payment = await _unitOfWork.Repository<Payment>()
                    .GetByIdAsync(paymentDTOUpdate.Id);

                if (payment == null)
                {
                    _logger.LogWarning("Payment with ID: {PaymentId} not found", paymentDTOUpdate.Id);
                    return null;
                }

                // Update payment properties
                if (paymentDTOUpdate.PaymentMethod.HasValue)
                {
                    payment.PaymentMethod = paymentDTOUpdate.PaymentMethod.Value;
                }


                //                _unitOfWork.Repository<Payment>().Update(payment);
                //                await _unitOfWork.CompleteAsync();

                return payment;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating payment {PaymentId}", paymentDTOUpdate.Id);
                throw;
            }
        }

        // Additional methods not in the interface but useful for business logic
        public async Task<bool> UserHasMembershipAsync(string userId)
        {
            try
            {
                var user = await _unitOfWork.Repository<User>()
                    .GetByIdAsync(userId);

                return user?.MembershipId != null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking membership for user {UserId}", userId);
                throw;
            }
        }
    }
}
    
    
