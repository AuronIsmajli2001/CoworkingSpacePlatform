using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enums;

namespace Application.DTOs.Payments
{
    public class PaymentDTOUpdate
    {
        [Required]
        public string Id { get; set; }
        public PaymentMethod? PaymentMethod { get; set; }
    }
}
