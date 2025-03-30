using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Memberships
{
    public class MembershipDTOCreate
    {
       
        public string UserId { get; set; }  
        public string Type { get; set; }
        public DateTime EndDate { get; set; }  
        public decimal Price { get; set; }  
    }
}
