using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.SpaceEquipments
{
    public class SpaceEquipmentDTOCreate
    {
        [Required]
        public string SpaceId { get; set; }  
        [Required]
        public string EquipmentId { get; set; } 
        [Required]
        public int Quantity { get; set; }
    }
}
