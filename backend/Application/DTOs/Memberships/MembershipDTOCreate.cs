using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Application.DTOs.Memberships
{
    public class MembershipDTOCreate
    {
       
        public string UserId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Type { get; set; } // "daily", "monthly", etc.

        public string Description { get; set; }

        [Required]
        public decimal Price { get; set; }

        public bool VatIncluded { get; set; }

        public bool Popular { get; set; }

        public IFormFile Image { get; set; }
        public string PaymentMethod { get; set; }
        public bool IsPaid { get; set; }
        public DateTime EndDate { get; set; }  
        public object Id { get; set; }
    }
}
