using Application.DTOs.SpaceEquipment;
using Application.DTOs.SpaceEquipments;
using Application.Interfaces.IUnitOfWork;
using Application.Services.Auth;
using Domain.SpaceEquipments;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

        public async Task CreateSpaceEquipmentAsync(SpaceEquipmentDTOCreate spaceEquipmentDTO)
        {
            try
            {
                _logger.LogInformation("Associating EquipmentId: {EquipmentId} with SpaceId: {SpaceId}",
                    spaceEquipmentDTO.EquipmentId, spaceEquipmentDTO.SpaceId);

                var spaceEquipment = new SpaceEquipment
                {
                    SpaceId = spaceEquipmentDTO.SpaceId,
                    EquipmentId = spaceEquipmentDTO.EquipmentId,
                    Quantity = spaceEquipmentDTO.Quantity
                };

                _unitOfWork.Repository<SpaceEquipment>().Create(spaceEquipment);
                await _unitOfWork.CompleteAsync();

                _logger.LogInformation("Successfully associated EquipmentId: {EquipmentId} with SpaceId: {SpaceId}",
                    spaceEquipmentDTO.EquipmentId, spaceEquipmentDTO.SpaceId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while associating EquipmentId: {EquipmentId} with SpaceId: {SpaceId}",
                    spaceEquipmentDTO.EquipmentId, spaceEquipmentDTO.SpaceId);
                throw;
            }
        }

        public async Task<IEnumerable<SpaceEquipmentDTORead>> GetAllSpaceEquipmentsAsync()
        {
            try
            {
                _logger.LogInformation("Fetching all space-equipment associations.");

                var spaceEquipments = await _unitOfWork.Repository<SpaceEquipment>().GetAllAsync();

                var spaceEquipmentDTOs = spaceEquipments.Select(se => new SpaceEquipmentDTORead
                {
                    SpaceId = se.SpaceId,
                    SpaceName = se.Space.Name,  
                    EquipmentId = se.EquipmentId,
                    EquipmentName = se.Equipment.Name, 
                    Quantity = se.Quantity
                }).ToList();

                return spaceEquipmentDTOs;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while fetching all space-equipment associations.");
                throw;
            }
        }

        public async Task<bool> DeleteSpaceEquipmentAsync(string spaceId, string equipmentId)
        {
            try
            {
                _logger.LogInformation("Removing association between SpaceId: {SpaceId} and EquipmentId: {EquipmentId}",
                    spaceId, equipmentId);

                var spaceEquipment = await _unitOfWork.Repository<SpaceEquipment>()
                    .GetByCondition(se => se.SpaceId == spaceId && se.EquipmentId == equipmentId)
                    .FirstOrDefaultAsync();

                if (spaceEquipment == null)
                {
                    _logger.LogWarning("No association found between SpaceId: {SpaceId} and EquipmentId: {EquipmentId}",
                        spaceId, equipmentId);
                    return false;
                }

                _unitOfWork.Repository<SpaceEquipment>().Delete(spaceEquipment);
                await _unitOfWork.CompleteAsync();

                _logger.LogInformation("Successfully removed association between SpaceId: {SpaceId} and EquipmentId: {EquipmentId}",
                    spaceId, equipmentId);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while removing association between SpaceId: {SpaceId} and EquipmentId: {EquipmentId}",
                    spaceId, equipmentId);
                throw;
            }
        }
    }
}
