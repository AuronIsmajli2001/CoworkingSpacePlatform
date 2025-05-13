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
    public string Id { get; set; }
    public string Type { get; set; }
    public string Name { get; set; }
    public int Quantity { get; set; }
    public double Price_per_piece { get; set; }
    public ICollection<SpaceEquipmentDTORead> SpaceEquipments { get; set; } = new List<SpaceEquipmentDTORead>();

    public ICollection<ReservationEquipment> ReservationEquipment { get; set; } = new List<ReservationEquipment>();
}
