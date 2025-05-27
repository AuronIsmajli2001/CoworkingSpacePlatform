namespace Application.DTOs.Memberships
{
    public class ConfirmMembershipDTO
    {
        public string UserId { get; set; }
        public string MembershipId { get; set; }
        public string PaymentMethod { get; set; }
        public decimal Amount { get; set; }
    }
}
