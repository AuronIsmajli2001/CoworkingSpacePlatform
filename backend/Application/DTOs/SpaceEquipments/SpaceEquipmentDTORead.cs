using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.SpaceEquipment
{
    public class SpaceEquipmentDTORead
    {
        public string SpaceId { get; set; }
        public string SpaceName { get; set; }  
        public string EquipmentId { get; set; }
        public string EquipmentName { get; set; }  
        public int Quantity { get; set; }
    }
}
