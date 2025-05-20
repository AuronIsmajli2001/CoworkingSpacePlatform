using Application.DTOs.ReservationEquipments;
using Application.DTOs.Spaces;
using Application.DTOs.Users;
using Domain.Enums;
using System;
using System.Collections.Generic;

public class ReservationDTORead
{
    public string Id { get; set; }
    public string UserId { get; set; }
    public string SpaceId { get; set; }
    public DateTime StartDateTime { get; set; }
    public DateTime EndDateTime { get; set; }
    public DateTime CreatedAt { get; set; }
    public ReservationStatus Status { get; set; }

    public UserDTORead User { get; set; }
    public SpaceDTORead Space { get; set; }

    public List<ReservationEquipmentDTORead> ReservationEquipment { get; set; } = new();
}
