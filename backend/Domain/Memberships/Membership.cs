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
        [ForeignKey("UserId")]
        public string UserId { get; set; }
        public string Type { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Price { get; set; }
        public string Status { get; set; }
        public User User { get; set; } 
    }

}