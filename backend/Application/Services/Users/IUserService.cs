using Application.DTOs.Users;

namespace Application.Services.IUserServices
{
    public interface IUserService
    {
        Task<bool> CreateUserAsync(UserDTOCreate userDto);
        Task<UserDTORead> GetUserByIdAsync(string id);
        Task<List<UserDTORead>> GetAllUsersAsync();
        Task<bool> UpdateUserAsync(string id, UserDTOUpdate userDto);
        Task<bool> DeleteUserAsync(string id);
    }
}
