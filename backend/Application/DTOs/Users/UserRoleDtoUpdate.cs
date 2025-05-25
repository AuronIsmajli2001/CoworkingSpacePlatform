using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Users
{
    public class UserRoleDtoUpdate
    {
        public Role Role { get; set; }
        public bool isActive { get; set; }
    }
}
