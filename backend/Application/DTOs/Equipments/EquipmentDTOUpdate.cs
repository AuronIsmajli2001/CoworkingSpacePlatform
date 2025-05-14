using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Equipments
{
    public class EquipmentDTOUpdate
    {
        public string Type { get; set; }
        public string Name { get; set; }
        public int Quantity { get; set; }
        public double Price_per_piece { get; set; }
    }
}
