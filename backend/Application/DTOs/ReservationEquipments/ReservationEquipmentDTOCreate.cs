using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.ReservationEquipments
{
   public  class ReservationEquipmentDTOCreate
    {

        public string? ReservationId { get; set; }
        public List<string>? EquipmentIds { get; set; }
        public List<int>? Quantity { get; set; }
    }
}
