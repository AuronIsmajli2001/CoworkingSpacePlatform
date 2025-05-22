using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Reservations;
using Domain.Reservations;

namespace Application.Services.Reservations
{
    public interface IReservationsService
    {
       
            Task<List<ReservationDTORead>> GetAllReservationsAsync();
            Task<ReservationDTORead> GetReservationByIdAsync(string id);
            Task<bool> CreateReservationAsync(ReservationDTOCreate dto);
            Task<bool> UpdateReservationAsync(string id, ReservationDTOUpdate dto); 
            Task<bool> DeleteReservationAsync(string id);
        
    }
}
