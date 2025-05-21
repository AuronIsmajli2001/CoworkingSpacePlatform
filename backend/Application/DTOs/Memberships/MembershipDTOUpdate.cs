using Domain.Enums;
using Domain.Users;

namespace Application.DTOs.Memberships
{
    public class MembershipDTOUpdate
    {
        public string Title { get; set; }
        public decimal Price { get; set; }
        public bool IncludesVAT { get; set; }
        public string Description { get; set; }
        public string AdditionalServices { get; set; }
        public DateTime Created_At { get; set; }
        public bool isActive { get; set; }
        public BillingType BillingType { get; set; }
    }
}