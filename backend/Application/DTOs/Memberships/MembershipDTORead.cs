namespace Application.DTOs.Memberships
{
    public class MembershipDTORead
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Price { get; set; }
        public bool IncludesVAT { get; set; }
        public string BillingType { get; set; }
        public string Description { get; set; }
        public string AdditionalServices { get; set; }
    }
}