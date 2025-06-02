using Application.DTOs.Memberships;
using Application.Interfaces.IUnitOfWork;
using Domain.Enums;
using Domain.Memberships;
using Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Application.Services.Users;
using Application.Services.IUserServices;

namespace Application.Services.Memberships
{
    public class MembershipService : IMembershipService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<MembershipService> _logger;
        private readonly IUserService _userService;

        public MembershipService(
            IUnitOfWork unitOfWork,
            ILogger<MembershipService> logger,
            IUserService userService)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _userService = userService;
        }

        public async Task<bool> CreateMembershipAsync(MembershipDTOCreate membershipDTO)
        {
            try
            {
                var membership = new Membership
                {
                    Id = Guid.NewGuid().ToString(),
                    Title = membershipDTO.Title,
                    Price = membershipDTO.Price,
                    IncludesVAT = membershipDTO.IncludesVAT,
                    BillingType = membershipDTO.BillingType,
                    Description = membershipDTO.Description,
                    AdditionalServices = membershipDTO.AdditionalServices,
                    Created_At = DateTime.UtcNow,
                    isActive = true
                };
                _unitOfWork.Repository<Membership>().Create(membership);
                await _unitOfWork.CompleteAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating membership");
                throw;
            }
        }

        public async Task<List<MembershipDTORead>> GetAllMembershipsAsync()
        {
            _logger.LogInformation("Fetching all memberships from the database.");

            var memberships = await _unitOfWork.Repository<Membership>().GetAllAsync();

            var membershipDTOs = memberships.Select(s => new MembershipDTORead
            {
                Id = s.Id,
                Title = s.Title,
                Price = s.Price,
                IncludesVAT = s.IncludesVAT,
                BillingType = s.BillingType,
                Description = s.Description,
                AdditionalServices = s.AdditionalServices,
                Created_At = s.Created_At,
                isActive = s.isActive,
               
            }).ToList();

            _logger.LogInformation("Successfully fetched {Count} memberships from the database.", membershipDTOs.Count);
            return membershipDTOs;
        }

        public async Task<MembershipDTORead> GetMembershipByIdAsync(string id)
        {
            try
            {
                _logger.LogInformation("Fetching membership from the database.");

                var s = await _unitOfWork.Repository<Membership>().GetByIdAsync(id);
                if (s == null) return null;

                return new MembershipDTORead
                {
                    Id = s.Id,
                    Title = s.Title,
                    Price = s.Price,
                    IncludesVAT = s.IncludesVAT,
                    BillingType = s.BillingType,
                    Description = s.Description,
                    AdditionalServices = s.AdditionalServices,
                    Created_At = s.Created_At,
                    isActive = s.isActive,
                };
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while retrieving membership.");
                throw new Exception(dbEx.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving membership.");
                throw;
            }
        }

        public async Task<bool> UpdateMembershipAsync(string id, MembershipDTOUpdate membershipDTO)
        {
            try
            {
                _logger.LogInformation("Updating membership with ID: {Id}", id);

                var membership = await _unitOfWork.Repository<Membership>().GetByIdAsync(id);

                if (membership == null)
                {
                    _logger.LogWarning("Cannot update. Membership with ID {Id} not found.", id);
                    throw null;
                }
                if(membershipDTO.Title != null)
                {
                    membership.Title = membershipDTO.Title;
                }
                if(membershipDTO.Price != null)
                {
                    membership.Price = (decimal)membershipDTO.Price;
                }
                if(membershipDTO.Description != null)
                {
                    membership.Description = membershipDTO.Description;
                }
                if(membershipDTO.IncludesVAT != null)
                {
                    membership.IncludesVAT = (bool)membershipDTO.IncludesVAT;
                }
                if(membershipDTO.BillingType != null)
                {
                    membership.BillingType = (BillingType)membershipDTO.BillingType;
                }
                if(membershipDTO.AdditionalServices != null)
                {
                    membership.AdditionalServices = membershipDTO.AdditionalServices;
                }
                if(membershipDTO.isActive != null)
                {
                    membership.isActive = (bool)membershipDTO.isActive;
                }
                _unitOfWork.Repository<Membership>().Update(membership);
                await _unitOfWork.CompleteAsync();

                _logger.LogInformation("Successfully updated membership with ID: {Id}", id);
                return true;
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while updating membership with ID: {Id}!", id);
                throw new Exception(dbEx.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while updating membership with ID: {Id}", id);
                throw;
            }
        }

        public async Task<bool> DeleteMembershipAsync(string id)
        {
            try
            {
                var membership = await _unitOfWork.Repository<Membership>().GetByIdAsync(id);

                if (membership == null)
                {
                    throw new Exception("Membership does not exist");
                }
                _unitOfWork.Repository<Membership>().Delete(membership);
                await _unitOfWork.CompleteAsync();
                return true;
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while deleting membership with ID: {Id}!", id);
                throw new Exception(dbEx.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while deleting membership with ID: {Id}", id);
                throw;
            }
        }

        public async Task<User> GetUserByIdAsync(string userId)
        {
            return await _unitOfWork.Repository<User>().GetByIdAsync(userId);
        }

        public async Task<bool> AssignMembershipToUserAsync(string userId, string membershipId)
        {
            var user = await _unitOfWork.Repository<User>().GetByIdAsync(userId);
            if (user == null) return false;
            if(user.MembershipId == null)
            {
                user.MembershipId = membershipId;
                _unitOfWork.Repository<User>().Update(user);
                await _unitOfWork.CompleteAsync();
                return true;
            }
            return false;
        }

        public async Task<MembershipDTORead> GetUserMembershipAsync(string userId)
        {
            _logger.LogInformation($"Fetching membership for user {userId}");

            _logger.LogInformation("Start GetUserMembershipAsync");
            _logger.LogInformation($"User ID received: {userId}");

            var user = await GetUserByIdAsync(userId);

            if (user == null)
            {
                _logger.LogWarning($"No user found with ID: {userId}");
                return null;
            }

            _logger.LogInformation($"User found: {user.FirstName} {user.LastName}, MembershipId: {user.MembershipId}");

            if (string.IsNullOrEmpty(user.MembershipId))
            {
                _logger.LogInformation($"User {userId} has no membership assigned.");
                return null;
            }

            _logger.LogInformation($"Fetching membership with ID: {user.MembershipId} for user {userId}");

            return await GetMembershipByIdAsync(user.MembershipId);

        }

        public async Task<bool> CancelMembershipAsync(string userId)
        {
            var user = await _unitOfWork.Repository<User>().GetByIdAsync(userId);
            if (user == null || user.MembershipId == null)
                return false;

            user.MembershipId = null;
            _unitOfWork.Repository<User>().Update(user);
            await _unitOfWork.CompleteAsync();
            return true;
        }



    }
}