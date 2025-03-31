using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Reservations;
using Domain.Reservations;

namespace Application.Services.Reservations
{
    interface IReservationsService
    {
        Task<IEnumerable<ReservationDTORead>> GetAllReservationsAsync();
        Task<ReservationDTORead> GetReservationByIdAsync(string id);
        Task CreateReservationAsync(ReservationDTOCreate dto);
        Task<Reservation> UpdateReservationAsync(string id, ReservationDTOUpdate dto);
        Task<bool> DeleteReservationAsync(string id);
    }
}
