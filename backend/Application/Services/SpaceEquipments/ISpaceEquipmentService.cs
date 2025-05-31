using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.SpaceEquipment;
using Application.DTOs.SpaceEquipments;

namespace Application.Services.SpaceEquipments
{
    public interface ISpaceEquipmentService
    {
        Task<bool> CreateSpaceEquipmentAsync(SpaceEquipmentDTOCreate spaceEquipmentDTO);
        Task<bool> UpdateSpaceEquipmentAsync(string spaceId, string equipmentId, int quantity);
        Task<bool> DeleteSpaceEquipmentAsync(string spaceId, string equipmentId);
        Task<List<SpaceEquipmentDTORead>> GetEquipmentsBySpaceIdAsync(string spaceId);

    }
}
