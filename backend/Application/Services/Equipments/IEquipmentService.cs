using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Equipments;
using Domain.Equipments;

namespace Application.Services.Equipments
{
    interface IEquipmentService
    {
        Task<IEnumerable<EquipmentDTORead>> GetAllEquipmentAsync();
        Task<EquipmentDTORead> GetEquipmentByIdAsync(string id);
        Task CreateEquipmentAsync(EquipmentDTOCreate dto);
        Task<Equipment> UpdateEquipmentAsync(string id, EquipmentDTOUpdate dto);
        Task<bool> DeleteEquipmentAsync(string id);
    }
}
