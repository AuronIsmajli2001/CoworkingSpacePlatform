using Application.DTOs.Users;
using Application.Interfaces.IUnitOfWork;
using Application.Services.IUserServices;
using Domain.Enums;
using Domain.Users;

using Microsoft.Extensions.Logging;

namespace Application.Services.Users
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<UserService> _logger;

        public UserService(IUnitOfWork unitOfWork, ILogger<UserService> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<UserDTORead> CreateUserAsync(UserDTOCreate userDto)
        {
            var user = new User
            {
                Id = Guid.NewGuid().ToString(),
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                UserName = userDto.UserName,
                Email = userDto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password), 
                Role = Enum.Parse<Role>(userDto.Role),
                Created_at = DateTime.UtcNow,
                Active = true
            };

            _unitOfWork.Users.Create(user);

            await _unitOfWork.CompleteAsync();

            return new UserDTORead
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                Email = user.Email,
                Role = user.Role.ToString(),
                CreatedAt = user.Created_at,
                Active = user.Active
            };
        }

        public async Task<UserDTORead> GetUserByIdAsync(string id)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null) return null;

            return new UserDTORead
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                Email = user.Email,
                Role = user.Role.ToString(),
                CreatedAt = user.Created_at,
                Active = user.Active
            };
        }

        public async Task<IEnumerable<UserDTORead>> GetAllUsersAsync()
        {
            var users = await _unitOfWork.Users.GetAllAsync();

            var usersDTO = users.Select(users => new UserDTORead
            {
                Id = users.Id,
                FirstName = users.FirstName,
                LastName = users.LastName,
                UserName = users.UserName,
                Email = users.Email,
                Role = users.Role.ToString(),
                CreatedAt = users.Created_at,
                Active = users.Active
            }).ToList();
            
            return usersDTO;
        }

        public async Task<bool> UpdateUserAsync(string id, UserDTOUpdate userDto)
        {
            
            var user = await _unitOfWork.Users.GetByIdAsync(id);

            if (user != null)
            {
                user.FirstName = userDto.FirstName;
                user.LastName = userDto.LastName;
                user.Email = userDto.Email;
                user.Password = userDto.Password;
                user.UserName = userDto.Username;
                _unitOfWork.Users.Update(user);
                await _unitOfWork.CompleteAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> DeleteUserAsync(string id)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user != null)
            {
                _unitOfWork.Users.Delete(user);
                await _unitOfWork.CompleteAsync();
                return true;
            }
            return false;
        }
    }
}
