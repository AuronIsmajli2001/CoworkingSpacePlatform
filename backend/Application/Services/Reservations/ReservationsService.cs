using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTOs.Reservations;
using Application.DTOs.Spaces;
using Application.DTOs.Users;
using Application.Interfaces.IUnitOfWork;
using Application.Services.Auth;
using Application.Services.ReservationEquipments;
using Domain.Enums;
using Domain.Reservations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

namespace Application.Services.Reservations
{
    public class ReservationService : IReservationsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<ReservationService> _logger;
        private readonly IReservationEquipmentService _reservationEquipmentService;

        public ReservationService(IUnitOfWork unitOfWork,ILogger<ReservationService> logger,IReservationEquipmentService reservationEquipmentService,IAuthService authService)
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
                var equipments = await _reservationEquipmentService.GetEquipmentsByReservationIdAsync(r.Id);

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

            var equipments = await _reservationEquipmentService.GetEquipmentsByReservationIdAsync(id);

            return new ReservationDTORead
            {
                UserId = reservation.UserId,
                SpaceId = reservation.SpaceId,
                StartDateTime = reservation.StartDateTime,
                EndDateTime = reservation.EndDateTime,
                Status = reservation.Status,
                ReservationEquipment = equipments
            };
        }

        public async Task<bool> CreateReservationAsync(ReservationDTOCreate dto)
        {
            var reservations = _unitOfWork.Repository<Reservation>()
            .GetByCondition(r => r.SpaceId == dto.SpaceId &&
                        r.EndDateTime > dto.StartDateTime &&
                        r.StartDateTime < dto.EndDateTime);

            if (reservations.Any())
            {
                _logger.LogWarning($"[CreateReservationAsync] Conflict: Space {dto.SpaceId} is already reserved during the selected time.");
                throw new Exception($"Space {dto.SpaceId} is already reserved during the selected time.");
            }

            if (dto.StartDateTime < DateTime.UtcNow)
            {
                throw new Exception("You cant reservate in the past!");
            }

            try
            {
                var reservation = new Reservation
                {
                    Id = dto.Id,
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
            try
            {
                var reservation = await _unitOfWork.Repository<Reservation>().GetByIdAsync(id);
                if (reservation != null)
                {
                    reservation.StartDateTime = dto.StartDateTime;
                    reservation.EndDateTime = dto.EndDateTime;
                    reservation.Status = dto.Status;

                    _unitOfWork.Repository<Reservation>().Update(reservation);
                    await _unitOfWork.CompleteAsync();

                    return true;
                }
                return false;
            }
            catch(DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while updating reservation with ID: {Id} !", id);
                throw new Exception(dbEx.Message);
            }

            catch(Exception ex)
            {
                _logger.LogError(ex, "Error while updating reservation with ID: {Id}", id);
                throw;
            }

        }

        public async Task<bool> DeleteReservationAsync(string id)
        {
            try
            {
                var reservation = await _unitOfWork.Repository<Reservation>().GetByIdAsync(id);
                if (reservation != null)
                {
                    _unitOfWork.Repository<Reservation>().Delete(reservation);
                    await _unitOfWork.CompleteAsync();

                    return true;
                }
                return false;
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while deleting reservation with ID: {Id} !", id);
                throw new Exception(dbEx.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while deleting reservation with ID: {Id}", id);
                throw;
            }
        }

        public async Task<bool> CancelReservationAsync(string id)
        {
            var reservation = await _unitOfWork.Repository<Reservation>().GetByIdAsync(id);

            if (reservation == null || reservation.Status == ReservationStatus.Cancelled)
            {
                _logger.LogWarning($"[CancelReservationAsync] Reservation with ID {id} not found or already cancelled.");
                return false;
            }

            reservation.Status = ReservationStatus.Cancelled;
            _unitOfWork.Repository<Reservation>().Update(reservation);
            await _unitOfWork.CompleteAsync();

            _logger.LogInformation($"[CancelReservationAsync] Reservation with ID {id} was cancelled.");
            return true;
        }



        public async Task<List<ReservationDTORead>> GetReservationsByUserIdAsync(string userId)
        {
            _logger.LogInformation($"Fetching reservations for user ID: {userId}");

            var reservations = await _unitOfWork.Repository<Reservation>().GetAll()
                .Where(r => r.UserId == userId)
                .Include(r => r.User)
                .Include(r => r.Space)
                .ToListAsync();

            var result = new List<ReservationDTORead>();

            foreach (var r in reservations)
            {
                var equipments = await _reservationEquipmentService.GetEquipmentsByReservationIdAsync(r.Id);

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

    }
}
