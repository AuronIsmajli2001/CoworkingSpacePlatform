using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Auth
{
    public class AuthTokens
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public int ExpiresIn { get; set; }  // Seconds until access token expiration
        public DateTime RefreshTokenExpiry { get; set; }  // Absolute expiry time
    }
}
