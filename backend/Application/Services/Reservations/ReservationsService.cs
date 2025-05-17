using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Reservations;
using Application.Interfaces.IUnitOfWork;
using Domain.Reservations;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.Reservations
{
    public class ReservationService : IReservationsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<ReservationService> _logger;

        public ReservationService(IUnitOfWork unitOfWork, ILogger<ReservationService> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<IEnumerable<ReservationDTORead>> GetAllReservationsAsync()
        {
            var reservations = await _unitOfWork.Repository<Reservation>().GetAllAsync();

            return reservations.Select(r => new ReservationDTORead
            {
                
                UserId = r.UserId,
                SpaceId = r.SpaceId,
                StartDateTime = r.StartDateTime,
                EndDateTime = r.EndDateTime,
                Status = r.Status
            }).ToList();
        }

#pragma warning disable CS8613 // Nullability of reference types in return type doesn't match implicitly implemented member.
        public async Task<ReservationDTORead?> GetReservationByIdAsync(string id)
#pragma warning restore CS8613 // Nullability of reference types in return type doesn't match implicitly implemented member.
        {
            var reservation = await _unitOfWork.Repository<Reservation>().GetByIdAsync(id);

            if (reservation == null)
                return null;

            return new ReservationDTORead
            {
               
                UserId = reservation.UserId,
                SpaceId = reservation.SpaceId,
                StartDateTime = reservation.StartDateTime,
                EndDateTime = reservation.EndDateTime,
                Status = reservation.Status
            };
        }

        public async Task CreateReservationAsync(ReservationDTOCreate dto)
        {
            var reservation = new Reservation
            {
                Id = Guid.NewGuid().ToString(),
                UserId = dto.UserId,
                SpaceId = dto.SpaceId,
                StartDateTime = dto.StartDateTime,
                EndDateTime = dto.EndDateTime,
                Created_at = DateTime.Now,
                Status = Domain.Enums.ReservationStatus.Pending
            };

            _unitOfWork.Repository<Reservation>().Create(reservation);
            await _unitOfWork.CompleteAsync();
        }

#pragma warning disable CS8613 // Nullability of reference types in return type doesn't match implicitly implemented member.
        public async Task<Reservation?> UpdateReservationAsync(string id, ReservationDTOUpdate dto)
#pragma warning restore CS8613 // Nullability of reference types in return type doesn't match implicitly implemented member.
        {
            var reservation = await _unitOfWork.Repository<Reservation>().GetByIdAsync(id);
            if (reservation == null) return null;

            reservation.StartDateTime = dto.StartDateTime;
            reservation.EndDateTime = dto.EndDateTime;
            reservation.Status = dto.Status;

            _unitOfWork.Repository<Reservation>().Update(reservation);
            await _unitOfWork.CompleteAsync();

            return reservation;
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