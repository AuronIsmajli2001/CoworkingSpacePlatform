using Domain.Enums;
using Domain.Users;
using System.ComponentModel.DataAnnotations.Schema;

namespace Application.DTOs.Memberships
{
    public class MembershipDTORead
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public decimal Price { get; set; }
        public bool IncludesVAT { get; set; }
        public string Description { get; set; }
        public string AdditionalServices { get; set; }
        public DateTime Created_At { get; set; }
        public bool isActive { get; set; }
        public BillingType BillingType { get; set; }
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}