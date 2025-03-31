﻿using Domain.ReservationEquipments;
using Domain.SpaceEquipments;
using Domain.Spaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Equipments
{
    public class Equipment
    {
        [Key]
        public string Id {  get; set; }
        public string Type { get; set; }
        public string Name { get; set; }
        public int quantity { get; set; }
        public double price_per_piece { get; set; }
        public ICollection<SpaceEquipment> SpaceEquipment { get; set; } = new List<SpaceEquipment>();
        public ICollection<ReservationEquipment> ReservationEquipment { get; set; } = new List<ReservationEquipment>();

    }
}
