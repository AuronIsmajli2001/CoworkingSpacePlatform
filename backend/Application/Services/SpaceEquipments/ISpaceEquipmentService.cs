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
        Task CreateSpaceEquipmentAsync(SpaceEquipmentDTOCreate spaceEquipmentDTO); 
        Task<IEnumerable<SpaceEquipmentDTORead>> GetAllSpaceEquipmentsAsync();   
        Task<bool> DeleteSpaceEquipmentAsync(string spaceId, string equipmentId);
    }
}
