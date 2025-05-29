using Domain.Enums;
using Domain.Memberships;
using System.ComponentModel.DataAnnotations.Schema;

namespace Application.DTOs.Users
{
    public class UserDTORead
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public bool Active { get; set; }
        public string MembershipId { get; set; }
        public DateTime CreatedAt { get; set; }
        public int TokenVersion { get; set; }
    }
}
