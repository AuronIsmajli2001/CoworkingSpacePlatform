using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.ReservationEquipments;
using Application.Interfaces.IUnitOfWork;
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

        public async Task<IEnumerable<ReservationEquipmentDTORead>> GetAllAsync()
        {
            var items = await _unitOfWork.Repository<ReservationEquipment>().GetAllAsync();

            return items.Select(x => new ReservationEquipmentDTORead
            {
                ReservationId = x.ReservationId,
                EquipmentId = x.EquipmentId,
                Quantity = x.Quantity,
               
            }).ToList();
        }

        public async Task<ReservationEquipmentDTORead> GetByIdAsync(string reservationId, string equipmentId)
        {
            var entity = await _unitOfWork.Repository<ReservationEquipment>()
                .GetByCondition(x => x.ReservationId == reservationId && x.EquipmentId == equipmentId)
                .FirstOrDefaultAsync();

            if (entity == null) return null;

            return new ReservationEquipmentDTORead
            {
                ReservationId = entity.ReservationId,
                EquipmentId = entity.EquipmentId,
                Quantity = entity.Quantity,
            };
        }

        

        public async Task CreateAsync(ReservationEquipmentDTOCreate dto)
        {
            var entity = new ReservationEquipment
            {
                ReservationId = dto.ReservationId,
                EquipmentId = dto.EquipmentId,
                Quantity = dto.Quantity
            };

            _unitOfWork.Repository<ReservationEquipment>().Create(entity);
            await _unitOfWork.CompleteAsync();
        }

        public async Task<ReservationEquipment> UpdateAsync(string reservationId, string equipmentId, ReservationEquipmentDTOUpdate dto)
        {
            var entity = await _unitOfWork.Repository<ReservationEquipment>()
     .GetByCondition(x => x.ReservationId == reservationId && x.EquipmentId == equipmentId)
     .FirstOrDefaultAsync();

            if (entity == null) return null;

            entity.Quantity = dto.Quantity;

            _unitOfWork.Repository<ReservationEquipment>().Update(entity);
            await _unitOfWork.CompleteAsync();

            return entity;
        }

        public async Task<bool> DeleteAsync(string reservationId, string equipmentId)
        {
            var entity = await _unitOfWork.Repository<ReservationEquipment>()
    .GetByCondition(x => x.ReservationId == reservationId && x.EquipmentId == equipmentId)
    .FirstOrDefaultAsync();

        
            if (entity == null) return false;

            _unitOfWork.Repository<ReservationEquipment>().Delete(entity);
            await _unitOfWork.CompleteAsync();

            return true;
        }
        public async Task<List<ReservationEquipmentDTORead>> GetByReservationIdAsync(string reservationId)
        {
            var items = await _unitOfWork.Repository<ReservationEquipment>()
                .GetByCondition(x => x.ReservationId == reservationId)
                .ToListAsync();

            return items.Select(x => new ReservationEquipmentDTORead
            {
                ReservationId = x.ReservationId,
                EquipmentId = x.EquipmentId,
                Quantity = x.Quantity
            }).ToList();
        }

    }
}
