using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Equipments;
using Domain.SpaceEquipments;

namespace Domain.Spaces
{
    public class Space
    {

        [Key]
        public string Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public int Capacity { get; set; }
        public double Price {  get; set; }
        public string Location { get; set; }
        public string Image_URL { get; set; }
        public List<SpaceEquipment> SpaceEquipment { get; set; } = new List<SpaceEquipment>();
    }
}
