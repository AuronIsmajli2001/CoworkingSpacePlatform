using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Equipments
{
    public class EquipmentDTOCreate
    {
        public string Type { get; set; }
        public string Name { get; set; }
        public int Quantity { get; set; }
        public double Price_per_piece { get; set; }
    }
}
