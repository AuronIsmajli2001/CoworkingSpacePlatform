using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Equipments;
using Domain.Reservations;

namespace Application.DTOs.ReservationEquipments
{
    public class ReservationEquipmentDTORead
    {
        public string ReservationId { get; set; }
        public string EquipmentId { get; set; }
        public int Quantity { get; set; }
      
    }
}
