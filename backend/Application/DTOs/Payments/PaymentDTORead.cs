using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enums;

namespace Application.DTOs.Payments
{
    public class PaymentDTORead
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string ReservationId { get; set; }
        public string MembershipId { get; set; }
        public DateTime CreatedAt { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
    }
}
