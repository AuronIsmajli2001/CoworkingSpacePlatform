using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Users;
using Microsoft.AspNetCore.Http;

namespace Application.DTOs.Memberships
{
    public class MembershipDTORead
    {
        public string Id { get; set; }

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
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; }
        public string UserId { get; set; }

    }
}
