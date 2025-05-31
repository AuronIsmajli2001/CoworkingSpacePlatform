using Application.DTOs.SpaceEquipment;
using Application.DTOs.SpaceEquipments;
using Application.Interfaces.IUnitOfWork;
using Domain.SpaceEquipments;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Services.SpaceEquipments
{
    public class SpaceEquipmentService : ISpaceEquipmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<SpaceEquipmentService> _logger;

        public SpaceEquipmentService(IUnitOfWork unitOfWork, ILogger<SpaceEquipmentService> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<bool> CreateSpaceEquipmentAsync(SpaceEquipmentDTOCreate dto)
        {
            if (dto.EquipmentIds != null && dto.Quantity != null)
            {
                if (dto.EquipmentIds.Count != dto.Quantity.Count)
                {
                    throw new ArgumentException("EquipmentIds and Quantity have the same count.");
                }

                for (int i = 0; i < dto.EquipmentIds.Count(); i++)
                {
                    var entity = new SpaceEquipment
                    {
                        SpaceId = dto.SpaceId,
                        EquipmentId = dto.EquipmentIds[i],
                        Quantity = dto.Quantity[i]
                    };
                    if (dto.Quantity[i] <= 0)
                    {
                        throw new ArgumentException("Quantity cant be negative or zero!");
                    }
                    _unitOfWork.Repository<SpaceEquipment>().Create(entity);
                }
                await _unitOfWork.CompleteAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> UpdateSpaceEquipmentAsync(string spaceId, string equipmentId, int quantity)
        {
            var entity = await _unitOfWork.Repository<SpaceEquipment>()
            .GetByCondition(x => x.SpaceId == spaceId && x.EquipmentId == equipmentId)
            .FirstOrDefaultAsync();

            if (entity != null)
            {
                entity.Quantity = quantity;

                _unitOfWork.Repository<SpaceEquipment>().Update(entity);
                await _unitOfWork.CompleteAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> DeleteSpaceEquipmentAsync(string spaceId, string equipmentId)
        {
            var entity = await _unitOfWork.Repository<SpaceEquipment>()
            .GetByCondition(x => x.SpaceId == spaceId && x.EquipmentId == equipmentId)
            .FirstOrDefaultAsync();

            if (entity != null)
            {
                _unitOfWork.Repository<SpaceEquipment>().Delete(entity);
                await _unitOfWork.CompleteAsync();
                return true;
            }
            return false;
        }

        public async Task<List<SpaceEquipmentDTORead>> GetEquipmentsBySpaceIdAsync(string spaceId)
        {
            var items = await _unitOfWork.Repository<SpaceEquipment>()
                .GetByCondition(x => x.SpaceId == spaceId)
                .ToListAsync();

            return items.Select(x => new SpaceEquipmentDTORead
            {
                SpaceId = x.SpaceId,
                EquipmentId = x.EquipmentId,
                Quantity = x.Quantity
            }).ToList();
        }
    }
}
