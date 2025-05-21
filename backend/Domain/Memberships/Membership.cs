using Domain.Enums;
using Domain.Users;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Memberships
{
   public class Membership
    {
        [Key]
        public string Id { get; set; }
        public string Title { get; set; }
        public DateTime Created_At { get; set; }
        public decimal Price { get; set; }
        public bool isActive { get; set; }
        public bool IncludesVAT { get; set; }
        public BillingType BillingType { get; set; }         
        public string Description { get; set; }         
        public string AdditionalServices { get; set; }
        public List<User> Users { get; set; } = new List<User>();
    }

}