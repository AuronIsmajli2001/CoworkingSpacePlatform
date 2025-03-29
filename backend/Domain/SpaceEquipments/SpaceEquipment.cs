using Domain.Equipments;
using Domain.Spaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.SpaceEquipments
{
    public class SpaceEquipment
    {
        [ForeignKey("SpaceId")]
        public string SpaceId { get; set; }
        [ForeignKey("EquipmentId")]
        public string EquipmentId { get; set; }
        public int Quantity { get; set; }
        public Space Space { get; set; }
        public Equipment Equipment { get; set; }
    }
}
