using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.ReservationEquipments;
using Domain.ReservationEquipments;

namespace Application.Services.ReservationEquipments
{
    public interface IReservationEquipmentService
    {
        Task<List<ReservationEquipmentDTORead>> GetAllAsync();
        Task<ReservationEquipmentDTORead> GetByIdAsync(string reservationId, string equipmentId);
        Task<bool> CreateAsync(ReservationEquipmentDTOCreate dto);
        Task<bool> UpdateAsync(string reservationId, string equipmentId, ReservationEquipmentDTOUpdate dto);
        Task<bool> DeleteAsync(string reservationId, string equipmentId);
        Task<List<ReservationEquipmentDTORead>> GetByReservationIdAsync(string reservationId);

    }
}
