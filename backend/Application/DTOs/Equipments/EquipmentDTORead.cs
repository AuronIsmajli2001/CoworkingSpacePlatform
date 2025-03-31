using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.SpaceEquipment;
using Domain.ReservationEquipments;
using Domain.SpaceEquipments;
namespace Application.DTOs.Equipments;


public class EquipmentDTORead
{
    public string Type { get; set; }
    public string Name { get; set; }
    public int quantity { get; set; }
    public double price_per_piece { get; set; }
    public List<SpaceEquipmentDTORead> SpaceEquipments { get; set; } = new List<SpaceEquipmentDTORead>();

    public List<ReservationEquipment> ReservationEquipment { get; set; } = new List<ReservationEquipment>();
}
