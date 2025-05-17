using Domain.Enums;
using Domain.ReservationEquipments;
using Domain.Spaces;
using Domain.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Reservations
{
    public class Reservation
    {
        [Key]
        public string Id { get; set; }
        [ForeignKey("UserId")]
        public string UserId { get; set; }
        [ForeignKey("SpaceId")]
        public string SpaceId { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public DateTime Created_at { get; set; } = DateTime.Now;
        public ReservationStatus Status { get; set; }
        public ICollection<ReservationEquipment> ReservationEquipment { get; set; }
        public User User { get; set; }
        public Space Space { get; set; }
        public string PaymentMethod { get; set; }
        public bool IsPaid { get; set; }
    }
}
