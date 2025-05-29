using Application.DTOs.Users;
using Application.Interfaces.IUnitOfWork;
using Application.Services.Auth;
using Application.Services.IUserServices;
using Domain.Enums;
using Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Services.Users
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<UserService> _logger;
        private readonly IAuthService _authService;

        public UserService(IUnitOfWork unitOfWork, ILogger<UserService> logger, IAuthService authService)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _authService = authService;
        }

        public async Task<bool> DeactivateUserOrChangeRole(string id, UserRoleDtoUpdate dto, string token)
        {
            var principal = _authService.VerifyToken(token);
            if (principal == null)
            {
                throw new UnauthorizedAccessException("Invalid or expired token");
            }

            var role = principal.FindFirst("role")?.Value;

            if(role != "SuperAdmin")
            {
                throw new UnauthorizedAccessException("You are not authorized to perform this action");
            }

            try
            {
                var user = await _unitOfWork.Repository<User>().GetByIdAsync(id);

                if(user != null) 
                {
                    user.Role = dto.Role;
                    user.Active = dto.isActive;

                    _unitOfWork.Repository<User>().Update(user);
                    await _unitOfWork.CompleteAsync();
                    return true;
                }   

                return false;
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while updating user with ID: {Id} !", id);
                throw new Exception(dbEx.Message);
            }

            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while updating user with ID: {Id}", id);
                throw;
            }

        }

        public async Task<bool> CreateUserAsync(UserDTOCreate userDto)
        {
            try
            {
                var user = new User
                {
                    Id = Guid.NewGuid().ToString(),
                    FirstName = userDto.FirstName,
                    LastName = userDto.LastName,
                    UserName = userDto.UserName,
                    Email = userDto.Email,
                    Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password),
                    Role = userDto.Role,
                    Created_at = DateTime.UtcNow,
                    Active = true
                };
                var users = _unitOfWork.Repository<User>().GetAll();

                foreach (var person in users)
                {
                    if (person.Email == user.Email)
                    {
                        throw new Exception("Email is already registered");
                    }
                    if (person.UserName == user.UserName)
                    {
                        throw new Exception("This username is registered!");
                    }
                }

                _unitOfWork.Repository<User>().Create(user);
                await _unitOfWork.CompleteAsync();
                return true;
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while creating user with UserName: {Name}", userDto.UserName);
                throw new Exception("Database error!" + dbEx.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while creating user with Name: {Name}", userDto.UserName);
                throw;
            }

        }

        public async Task<UserDTORead> GetUserByIdAsync(string id)
        {
            try
            {
                var user = await _unitOfWork.Repository<User>().GetByIdAsync(id);
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
                    MembershipId = user.MembershipId,
                    Active = user.Active
                };
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while retrieving user.");
                throw new Exception(dbEx.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving user.");
                throw;
            }

        }

        public async Task<List<UserDTORead>> GetAllUsersAsync()
        {
            try
            {
                var users = await _unitOfWork.Repository<User>().GetAllAsync();

                var usersDTO = users.Select(users => new UserDTORead
                {
                    Id = users.Id,
                    FirstName = users.FirstName,
                    LastName = users.LastName,
                    UserName = users.UserName,
                    Email = users.Email,
                    Role = users.Role.ToString(),
                    MembershipId = users.MembershipId,
                    CreatedAt = users.Created_at,
                    Active = users.Active
                }).ToList();

                return usersDTO;
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while retrieving all users.");
                throw new Exception(dbEx.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving all users.");
                throw;
            }

        }

        public async Task<bool> UpdateUserAsync(string id, UserDTOUpdate userDto)
        {
            try
            {
                var user = await _unitOfWork.Repository<User>().GetByIdAsync(id);

                var users = await _unitOfWork.Repository<User>().GetAllAsync();

                if (user != null)
                {
                    foreach (var person in users)
                    {
                        if (person.UserName == userDto.Username)
                        {
                            throw new Exception("Username is being used");
                        }
                        if (person.Email == userDto.Email)
                        {
                            throw new Exception("This Email is already in use");
                        }
                    }
                    if(userDto.FirstName != null)
                    {
                        user.FirstName = userDto.FirstName;
                    }

                    if(userDto.LastName != null)
                    {
                        user.LastName = userDto.LastName;
                    }

                    if(userDto.Email != null)
                    {
                        user.Email = userDto.Email;
                    }

                    if(userDto.Password  != null)
                    {
                        user.Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
                    }

                    if(userDto.Username != null)
                    {
                        user.UserName = userDto.Username;
                    }
                    

                    _unitOfWork.Repository<User>().Update(user);
                    await _unitOfWork.CompleteAsync();
                    return true;
                }
                return false;
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while updating user with ID: {Id} !", id);
                throw new Exception(dbEx.Message);
            }

            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while updating user with ID: {Id}", id);
                throw;
            }
        }

        public async Task<bool> DeleteUserAsync(string id)
        {
            try
            {
                var user = await _unitOfWork.Repository<User>().GetByIdAsync(id);
                if (user != null)
                {
                    _unitOfWork.Repository<User>().Delete(user);
                    await _unitOfWork.CompleteAsync();
                    return true;
                }
                return false;
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while deleting user with ID: {Id} !", id);
                throw new Exception(dbEx.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while deleting user with ID: {Id}", id);
                throw;
            }
        }
    }
}
