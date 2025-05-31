using Application.DTOs.ReservationEquipments;
using Application.Interfaces.IUnitOfWork;
using Application.Services.Auth;
using Domain.ReservationEquipments;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Services.ReservationEquipments
{
    public class ReservationEquipmentService : IReservationEquipmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<ReservationEquipmentService> _logger;

        public ReservationEquipmentService(IUnitOfWork unitOfWork, ILogger<ReservationEquipmentService> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<bool> CreateReservationEquipmentAsync(ReservationEquipmentDTOCreate dto)
        {
            if (dto.EquipmentIds != null && dto.Quantity != null)
            {
                if (dto.EquipmentIds.Count != dto.Quantity.Count)
                {
                    throw new ArgumentException("EquipmentIds and Quantity have the same count.");
                }

                for (int i = 0; i < dto.EquipmentIds.Count(); i++)
                {
                    var entity = new ReservationEquipment
                    {
                        ReservationId = dto.ReservationId,
                        EquipmentId = dto.EquipmentIds[i],
                        Quantity = dto.Quantity[i]
                    };
                    if(dto.Quantity[i] <= 0)
                    {
                        throw new ArgumentException("Quantity cant be negative or zero!");
                    }
                    _unitOfWork.Repository<ReservationEquipment>().Create(entity);
                }
                await _unitOfWork.CompleteAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> UpdateReservationEquipmentAsync(string reservationId, string equipmentId, int quantity)
        {
            var entity = await _unitOfWork.Repository<ReservationEquipment>()
            .GetByCondition(x => x.ReservationId == reservationId && x.EquipmentId == equipmentId)
            .FirstOrDefaultAsync();

            if(entity != null)
            {
                entity.Quantity = quantity;
                _unitOfWork.Repository<ReservationEquipment>().Update(entity);
                await _unitOfWork.CompleteAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> DeleteReservationEquipmentAsync(string reservationId, string equipmentId)
        {
            var entity = await _unitOfWork.Repository<ReservationEquipment>()
            .GetByCondition(x => x.ReservationId == reservationId && x.EquipmentId == equipmentId)
            .FirstOrDefaultAsync();

            if(entity != null)
            {
                _unitOfWork.Repository<ReservationEquipment>().Delete(entity);
                await _unitOfWork.CompleteAsync();

                return true;
            }
            return false;  
        }

        public async Task<List<ReservationEquipmentDTORead>> GetEquipmentsByReservationIdAsync(string reservationId)
        {
            var items = await _unitOfWork.Repository<ReservationEquipment>()
                .GetByCondition(x => x.ReservationId == reservationId)
                .Include(x => x.Equipment)
                .ToListAsync();

            return items.Select(x => new ReservationEquipmentDTORead
            {
                ReservationId = x.ReservationId,
                EquipmentId = x.EquipmentId,
                Quantity = x.Quantity,
                Name = x.Equipment.Name,
                Type = x.Equipment.Type
            }).ToList();
        }
    }
}
