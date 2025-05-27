using Application.DTOs.Memberships;
using Domain.Users;

namespace Application.Services.Memberships
{
    public interface IMembershipService
    {
        Task<bool> CreateAsync(MembershipDTOCreate membershipDTO);
        Task<List<MembershipDTORead>> GetAllAsync();
        Task<MembershipDTORead> GetByIdAsync(string id);
        Task<bool> UpdateMembershipAsync(string id,MembershipDTOUpdate membershipDTO);
        Task<bool> DeleteAsync(string id);

        Task<User> GetUserByIdAsync(string userId);
        Task<bool> AssignMembershipToUserAsync(string userId, string membershipId);

        Task<MembershipDTORead> GetUserMembershipAsync(string userId);
    }
}