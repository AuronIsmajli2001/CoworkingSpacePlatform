using Domain.Equipments;
using Domain.Reservations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Reservation;
using Domain.Equipment;

namespace Domain.ReservationEquipments
{
    public class ReservationEquipment
    {
        [ForeignKey("ReservationId")]
        public string ReservationId { get; set; }
        [ForeignKey("EquipmentId")]
        public string EquipmentId { get; set; }
        public int Quantity { get; set; }
        public Reservation Reservation { get; set; }
        public Equipment Equipment { get; set; }
    }
}
