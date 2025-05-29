using Application.DTOs.Memberships;
using Domain.Users;

namespace Application.Services.Memberships
{
    public interface IMembershipService
    {
        Task<bool> CreateMembershipAsync(MembershipDTOCreate membershipDTO);
        Task<List<MembershipDTORead>> GetAllMembershipsAsync();
        Task<MembershipDTORead> GetMembershipByIdAsync(string id);
        Task<bool> UpdateMembershipAsync(string id,MembershipDTOUpdate membershipDTO);
        Task<bool> DeleteMembershipAsync(string id);
        Task<bool> AssignMembershipToUserAsync(string userId, string membershipId);
        Task<MembershipDTORead> GetUserMembershipAsync(string userId);
        Task<bool> CancelMembershipAsync(string userId);
    }
}