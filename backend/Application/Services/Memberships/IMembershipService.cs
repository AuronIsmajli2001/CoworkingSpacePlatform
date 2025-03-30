using System;
using Application.DTOs.Memberships;
using Domain.Memberships;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.Memberships
{
    public interface IMembershipService
    {
        Task<IEnumerable<MembershipDTORead>> GetAllMemberships();  
        Task<MembershipDTORead> GetMembershipById(string id);  
        Task CreateMembershipAsync(MembershipDTOCreate membershipDTO); 
        Task<Membership> UpdateMembershipAsync(MembershipDTOUpdate membershipDTO); 
        Task<bool> DeleteMembershipAsync(string id);  
    }
}
