using Domain.Enums;
using Domain.Memberships;
using Domain.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Memberships;


namespace Domain.Users
{
    public class User
    {
        [Key]
        public string Id {  get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public Role Role { get; set; }
        public DateTime Created_at { get; set; }
        public bool Active { get; set; }
        public Membership Membership { get; set; } 
    }
}
