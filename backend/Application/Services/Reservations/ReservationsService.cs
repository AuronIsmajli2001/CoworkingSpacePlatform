using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs.Reservations;
using Application.DTOs.Spaces;
using Application.DTOs.Users;
using Application.Interfaces.IUnitOfWork;
using Application.Services.ReservationEquipments;
using Domain.Reservations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Services.Reservations
{
    public class ReservationService : IReservationsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<ReservationService> _logger;
        private readonly IReservationEquipmentService _reservationEquipmentService;

        public ReservationService(
            IUnitOfWork unitOfWork,
            ILogger<ReservationService> logger,
            IReservationEquipmentService reservationEquipmentService)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _reservationEquipmentService = reservationEquipmentService;
        }

        public async Task<List<ReservationDTORead>> GetAllReservationsAsync()
        {
            _logger.LogInformation("Fetching all reservations...");

            var reservations = await _unitOfWork.Repository<Reservation>().GetAll()
                .Include(r => r.User)
                .Include(r => r.Space)
                .ToListAsync();

            var result = new List<ReservationDTORead>();

            foreach (var r in reservations)
            {
                var equipments = await _reservationEquipmentService.GetByReservationIdAsync(r.Id);

                result.Add(new ReservationDTORead
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    SpaceId = r.SpaceId,
                    StartDateTime = r.StartDateTime,
                    EndDateTime = r.EndDateTime,
                    Status = r.Status,
                    CreatedAt = r.Created_at,
                    ReservationEquipment = equipments,
                    User = r.User != null ? new UserDTORead
                    {
                        Id = r.User.Id,
                        UserName = r.User.UserName
                    } : null,
                    Space = r.Space != null ? new SpaceDTORead
                    {
                        Id = r.Space.Id,
                        Name = r.Space.Name
                    } : null
                });
            }

            return result;
        }

        public async Task<ReservationDTORead> GetReservationByIdAsync(string id)
        {
            var reservation = await _unitOfWork.Repository<Reservation>().GetByIdAsync(id);
            if (reservation == null) return null;

            return new ReservationDTORead
            {
                UserId = reservation.UserId,
                SpaceId = reservation.SpaceId,
                StartDateTime = reservation.StartDateTime,
                EndDateTime = reservation.EndDateTime,
                Status = reservation.Status
            };
        }

        public async Task<bool> CreateReservationAsync(ReservationDTOCreate dto)
        {
            try
            {
                var reservation = new Reservation
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId = dto.UserId,
                    SpaceId = dto.SpaceId,
                    PaymentMethod = dto.PaymentMethod,
                    StartDateTime = dto.StartDateTime,
                    EndDateTime = dto.EndDateTime,
                    Created_at = DateTime.UtcNow,
                    Status = dto.Status
                };

                _unitOfWork.Repository<Reservation>().Create(reservation);
                await _unitOfWork.CompleteAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[CreateReservationAsync] Failed: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> UpdateReservationAsync(string id, ReservationDTOUpdate dto)
        {
            var reservation = await _unitOfWork.Repository<Reservation>().GetByIdAsync(id);
            if (reservation == null) return false;

            reservation.StartDateTime = dto.StartDateTime;
            reservation.EndDateTime = dto.EndDateTime;
            reservation.Status = dto.Status;

            _unitOfWork.Repository<Reservation>().Update(reservation);
            await _unitOfWork.CompleteAsync();

            return true;
        }

        public async Task<bool> DeleteReservationAsync(string id)
        {
            var reservation = await _unitOfWork.Repository<Reservation>().GetByIdAsync(id);
            if (reservation == null) return false;

            _unitOfWork.Repository<Reservation>().Delete(reservation);
            await _unitOfWork.CompleteAsync();

            return true;
        }
    }
}
