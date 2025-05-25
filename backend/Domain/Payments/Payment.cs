using Domain.Enums;
using Domain.Memberships;
using Domain.Reservations;
using Domain.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Payments
{
    public class Payment
    {
        [Key]
        public string Id { get; set; }
        [ForeignKey("UserId")]
        public string UserId { get; set; }
        [ForeignKey("ReservationId")]

        public string? ReservationId { get; set; }

   


        [ForeignKey("MembershipId")]
        public string? MembershipId { get; set; }
        public Status Status { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public User User { get; set; }
        public Reservation Reservation { get; set; }
        public Membership Membership { get; set; }

    }
}
