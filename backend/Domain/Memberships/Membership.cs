using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Users;

namespace Domain.Memberships
{
    public class Membership
    {

        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        public string Type { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Price { get; set; }
        public string Status { get; set; }

        // Navigation property to link with User
        public virtual User User { get; set; }
    }
}
