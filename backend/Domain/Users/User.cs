﻿using Domain.Enums;
using Domain.Memberships;
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
        public String id {  get; set; }
        public String FirstName { get; set; }
        public String LastName { get; set; }
        public String Email { get; set; }
        public String Password { get; set; }
        public Role Role { get; set; }
        public DateTime Created_at { get; set; }
        public bool Active { get; set; }

        public virtual Membership Membership { get; set; } // 1-to-1 relationship
    }
}
