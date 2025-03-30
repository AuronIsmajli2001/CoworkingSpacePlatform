using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Memberships
{
    public class MembershipDTOUpdate
    {
        [Required]
        public string Id { get; set; }
        public string Type { get; set; } 
        public string Status { get; set; }  

    }
}
