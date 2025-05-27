using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enums;
using Domain.ReservationEquipments;
using Domain.Spaces;
using Domain.Users;

namespace Application.DTOs.Reservations
{
    public class ReservationDTOCreate
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string SpaceId { get; set; }
        public string PaymentMethod { get; set; }
        public bool IsPaid { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public ReservationStatus Status { get; set; }
    }


}

