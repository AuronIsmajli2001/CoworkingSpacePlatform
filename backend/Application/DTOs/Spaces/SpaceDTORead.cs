using Application.DTOs.SpaceEquipment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Spaces
{
    public class SpaceDTORead
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public int Capacity { get; set; }
        public double Price { get; set; }
        public string Location { get; set; }
        public string Image_URL { get; set; }
        public List<SpaceEquipmentDTORead> SpaceEquipments { get; set; } = new List<SpaceEquipmentDTORead>();
    }
}
