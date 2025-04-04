using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Auth
{
    public class AuthResponseDTO
    {
        public string AccessToken { get; set; } 
        public string RefreshToken { get; set; }  
        public int ExpiresIn { get; set; }       
        public DateTime RefreshTokenExpiry { get; set; }  
        public string UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
    }
}
