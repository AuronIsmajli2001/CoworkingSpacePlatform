using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enums;

namespace Application.DTOs.Reservations
{
    public class ReservationDTOUpdate
    {
        public string? UserId { get; set; }
        public string? SpaceId { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public ReservationStatus Status { get; set; }

    }
}
