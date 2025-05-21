using Application.DTOs.Memberships;

namespace Application.Services.Memberships
{
    public interface IMembershipService
    {
        Task<bool> CreateAsync(MembershipDTOCreate membershipDTO);
        Task<List<MembershipDTORead>> GetAllAsync();
        Task<MembershipDTORead> GetByIdAsync(string id);
        Task<bool> UpdateAsync(string id,MembershipDTOUpdate membershipDTO);
        Task<bool> DeleteAsync(string id);
    }
}