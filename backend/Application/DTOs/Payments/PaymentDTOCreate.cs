using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enums;

namespace Application.DTOs.Payments
{
    internal class PaymentDTOCreate
    {
        [Required]
        public string UserId { get; set; }
        public string ReservationId { get; set; }

        public PaymentMethod PaymentMethod { get; set; }
        public Status Status { get; internal set; }
    }
}
