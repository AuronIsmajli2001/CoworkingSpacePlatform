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
        Task<List<ReservationEquipmentDTORead>> GetAllReservationEquipmentsAsync();
        Task<bool> CreateReservationEquipmentAsync(ReservationEquipmentDTOCreate dto);
        Task<bool> UpdateReservationEquipmentAsync(string reservationId, string equipmentId, ReservationEquipmentDTOUpdate dto);
        Task<bool> DeleteReservationEquipmentAsync(string reservationId, string equipmentId);
        Task<List<ReservationEquipmentDTORead>> GetEquipmentsByReservationIdAsync(string reservationId);

    }
}
