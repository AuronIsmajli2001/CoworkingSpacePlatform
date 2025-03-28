using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ReservationEquipments
{
    public class ReservationEquipment
    {
        [ForeignKey("ReservationId")]
        public string ReservationId { get; set; }
        [ForeignKey("EquipmentId")]
        public string EquipmentId { get; set; }
        public int quantity { get; set; }
        public Reservation Reservation { get; set; }
        public Equipment Equipment { get; set; }
    }
}
