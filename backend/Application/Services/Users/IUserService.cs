using Application.DTOs.Users;

namespace Application.Services.IUserServices
{
    public interface IUserService
    {
        Task<UserDTORead> CreateUserAsync(UserDTOCreate userDto);
        Task<UserDTORead> GetUserByIdAsync(string id);
        Task<IEnumerable<UserDTORead>> GetAllUsersAsync();
        Task<bool> UpdateUserAsync(string id, UserDTOUpdate userDto);
        Task<bool> DeleteUserAsync(string id);
    }
}
