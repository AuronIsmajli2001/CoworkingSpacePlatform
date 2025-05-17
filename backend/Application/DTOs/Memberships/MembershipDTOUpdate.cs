using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Application.DTOs.Memberships
{
    public class MembershipDTOUpdate
    {
        [Required]
        public string Id { get; set; }
        public string Type { get; set; } 
        public string Status { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal? Price { get; set; }
        public bool? VatIncluded { get; set; }
        public bool? Popular { get; set; }
        public IFormFile Image { get; set; }

    }
}
