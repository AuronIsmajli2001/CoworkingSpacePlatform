using Application.DTOs.Users;

namespace Application.Services.IUserServices
{
    public interface IUserService
    {
        Task<UserDTORead> CreateUserAsync(UserDTOCreate userDto);
        Task<UserDTORead> GetUserByIdAsync(string id);
        Task<IEnumerable<UserDTORead>> GetAllUsersAsync();
        Task<UserDTORead> UpdateUserAsync(string id, UserDTOUpdate userDto);
        Task DeleteUserAsync(string id);
    }
}
