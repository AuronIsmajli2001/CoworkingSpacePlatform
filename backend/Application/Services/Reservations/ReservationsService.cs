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
using Application.Services.ReservationEquipments;
using Application.DTOs.Spaces;
using Application.DTOs.Users;


namespace Application.Services.Reservations
{
    public class ReservationService : IReservationsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<ReservationService> _logger;
        private readonly IReservationEquipmentService _reservationEquipmentService;


        //public ReservationService(IUnitOfWork unitOfWork, ILogger<ReservationService> logger)
        //{
        //    _unitOfWork = unitOfWork;
        //    _logger = logger;
        //}
        public ReservationService(
    IUnitOfWork unitOfWork,
    ILogger<ReservationService> logger,
    IReservationEquipmentService reservationEquipmentService)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _reservationEquipmentService = reservationEquipmentService;
        }

        //public async Task<IEnumerable<ReservationDTORead>> GetAllReservationsAsync()
        //{
        //    Console.WriteLine(">>> GET ALL RESERVATIONS CALLED");
        //    _logger.LogInformation("Starting to fetch all reservations...");

        //    var reservations = await _unitOfWork.Repository<Domain.Reservations.Reservation>().GetAllAsync();

        //    Console.WriteLine($">>> Reservation count: {reservations.Count}");


        //    _logger.LogInformation("Fetched {Count} reservations from DB.", reservations.Count);

        //    var result = new List<ReservationDTORead>();


        //    foreach (var r in reservations)

        //    {
        //        _logger.LogInformation("Processing reservation with ID: {Id}", r.Id);

        //        var equipments = await _reservationEquipmentService.GetByReservationIdAsync(r.Id);


        //        result.Add(new ReservationDTORead
        //        {
        //            UserId = r.UserId,
        //            SpaceId = r.SpaceId,
        //            StartDateTime = r.StartDateTime,
        //            EndDateTime = r.EndDateTime,
        //            Status = r.Status,
        //            ReservationEquipment = equipments
        //        });
        //    }

        //    return result;
        //}

        public async Task<IEnumerable<ReservationDTORead>> GetAllReservationsAsync()
        {
            _logger.LogInformation("Starting to fetch all reservations...");

            // Include related User and Space data in the query
            var reservations = await _unitOfWork.Repository<Reservation>().GetAll()
          .Include(r => r.User)
          .Include(r => r.Space)
          .ToListAsync();


            var result = new List<ReservationDTORead>();

            foreach (var r in reservations)
            {
                _logger.LogInformation("Processing reservation with ID: {Id}", r.Id);

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
                    // Add these lines to populate the User and Space DTOs
                    User = r.User != null ? new UserDTORead
                    {
                        Id = r.User.Id,
                        UserName = r.User.UserName // or whatever property has the username
                                                   // Include other user properties as needed
                    } : null,
                    Space = r.Space != null ? new SpaceDTORead
                    {
                        Id = r.Space.Id,
                        Name = r.Space.Name // or whatever property has the space name
                                            // Include other space properties as needed
                    } : null
                });
            }

            return result;
        }
        public async Task<ReservationDTORead> GetReservationByIdAsync(string id)
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
            try
            {
                var reservation = new Domain.Reservations.Reservation
                {
                    Id = Guid.NewGuid().ToString(),

                    UserId = dto.UserId,
                    SpaceId = dto.SpaceId,
                    StartDateTime = dto.StartDateTime,
                    EndDateTime = dto.EndDateTime,
                    Created_at = DateTime.Now,
                    Status = dto.Status
                };

                _unitOfWork.Repository<Reservation>().Create(reservation);
                await _unitOfWork.CompleteAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"[CreateReservationAsync] Failed: {ex.Message}");
                throw; // Optional: keep this to let Swagger show the 500
            }
        }


        //public async Task<ReservationDTORead> UpdateReservationAsync(string id, ReservationDTOUpdate dto)

        //{
        //    var reservation = await _unitOfWork.Repository<Reservation>().GetByIdAsync(id);
        //    if (reservation == null) return null;

        //    reservation.StartDateTime = dto.StartDateTime;
        //    reservation.EndDateTime = dto.EndDateTime;
        //    reservation.Status = dto.Status;

        //    _unitOfWork.Repository<Reservation>().Update(reservation);
        //    await _unitOfWork.CompleteAsync();

        //    return reservation;
        //}

        public async Task<ReservationDTORead> UpdateReservationAsync(string id, ReservationDTOUpdate dto)
        {
            var reservation = await _unitOfWork.Repository<Reservation>().GetByIdAsync(id);
            if (reservation == null) return null;

            reservation.StartDateTime = dto.StartDateTime;
            reservation.EndDateTime = dto.EndDateTime;
            reservation.Status = dto.Status;

            _unitOfWork.Repository<Reservation>().Update(reservation);
            await _unitOfWork.CompleteAsync();

            var equipments = await _reservationEquipmentService.GetByReservationIdAsync(reservation.Id);

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