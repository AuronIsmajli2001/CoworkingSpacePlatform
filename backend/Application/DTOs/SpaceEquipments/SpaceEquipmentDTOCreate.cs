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
        public string? SpaceId { get; set; }
        public List<string>? EquipmentIds { get; set; }
        public List<int>? Quantity { get; set; }
    }
}
