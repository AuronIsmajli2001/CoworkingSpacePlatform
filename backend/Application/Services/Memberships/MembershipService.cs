//using Application.DTOs.Memberships;
//using Application.Interfaces.IUnitOfWork;
//using Domain.Memberships;
//using Domain.Users;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Logging;
//using Application.Services.Users;  


//namespace Application.Services.Memberships
//{
//    public class MembershipService : IMembershipService
//    {
//        private readonly IUnitOfWork _unitOfWork;
//        private readonly ILogger<MembershipService> _logger;

//        public MembershipService(IUnitOfWork unitOfWork, ILogger<MembershipService> logger)
//        {
//            _unitOfWork = unitOfWork;
//            _logger = logger;
//        }

//        public async Task<bool> CreateAsync(MembershipDTOCreate membershipDTO)
//        {
//            try
//            {
//                var membership = new Membership
//                {
//                    Id = Guid.NewGuid().ToString(),
//                    Title = membershipDTO.Title,
//                    Price = membershipDTO.Price,
//                    IncludesVAT = membershipDTO.IncludesVAT,
//                    BillingType = membershipDTO.BillingType,
//                    Description = membershipDTO.Description,
//                    AdditionalServices = membershipDTO.AdditionalServices,
//                    Created_At = DateTime.UtcNow,
//                    isActive = true 
//                };
//                _unitOfWork.Repository<Membership>().Create(membership);
//                await _unitOfWork.CompleteAsync();
//                return true;
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error creating membership");
//                throw;
//            }
//        }

//        public async Task<List<MembershipDTORead>> GetAllAsync()
//        {
//            _logger.LogInformation("Fetching all memberships from the database.");

//            var memberships = await _unitOfWork.Repository<Membership>().GetAllAsync();

//            var membershipDTOs = memberships.Select(s => new MembershipDTORead
//            {
//                Id = s.Id,
//                Title = s.Title,
//                Price = s.Price,
//                IncludesVAT = s.IncludesVAT,
//                BillingType = s.BillingType,
//                Description = s.Description,
//                AdditionalServices = s.AdditionalServices,
//                Created_At = s.Created_At,
//                isActive = s.isActive,
//                Users = s.Users

//            }).ToList();

//            _logger.LogInformation("Successfully fetched {Count} memberships from the database.", membershipDTOs.Count);

//            return membershipDTOs;
//        }

//        public async Task<MembershipDTORead> GetByIdAsync(string id)
//        {
//            try
//            {
//                _logger.LogInformation("Fetching membership from the database.");

//                var s = await _unitOfWork.Repository<Membership>().GetByIdAsync(id);
//                if (s == null) return null;

//                return new MembershipDTORead
//                {
//                    Id = s.Id,
//                    Title = s.Title,
//                    Price = s.Price,
//                    IncludesVAT = s.IncludesVAT,
//                    BillingType = s.BillingType,
//                    Description = s.Description,
//                    AdditionalServices = s.AdditionalServices,
//                    Created_At = s.Created_At,
//                    isActive = s.isActive,
//                    Users = s.Users
//                };
//            }
//            catch (DbUpdateException dbEx)
//            {
//                _logger.LogError(dbEx, "Database error while retrieving membership.");
//                throw new Exception(dbEx.Message);
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Unexpected error while retrieving membership.");
//                throw;
//            }

//        }

//        public async Task<bool> UpdateMembershipAsync(string id,MembershipDTOUpdate membershipDTO)
//        {
//            try
//            {
//                _logger.LogInformation("Updating membership with ID: {Id}", id);

//                var membership = await _unitOfWork.Repository<Membership>().GetByIdAsync(id);

//                if (membership == null)
//                {
//                    _logger.LogWarning("Cannot update. Membership with ID {Id} not found.", id);
//                    throw null;
//                }

//                membership.Title = membershipDTO.Title;
//                membership.Price = membershipDTO.Price;
//                membership.IncludesVAT = membershipDTO.IncludesVAT;
//                membership.BillingType = membershipDTO.BillingType;
//                membership.Description = membershipDTO.Description;
//                membership.AdditionalServices = membershipDTO.AdditionalServices;
//                membership.Created_At = membershipDTO.Created_At;
//                membership.isActive = membershipDTO.isActive;

//                _unitOfWork.Repository<Membership>().Update(membership);
//                await _unitOfWork.CompleteAsync();

//                _logger.LogInformation("Successfully updated membership with ID: {Id}", id);

//                return true;
//            }
//            catch (DbUpdateException dbEx)
//            {
//                _logger.LogError(dbEx, "Database error while updating membership with ID: {Id} !", id);
//                throw new Exception(dbEx.Message);
//            }

//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error while updating membership with ID: {Id}", id);
//                throw;
//            }
//        }

//        public async Task<bool> DeleteAsync(string id)
//        {
//            try
//            {
//                var membership = await _unitOfWork.Repository<Membership>().GetByIdAsync(id);

//                if (membership == null)
//                {

//                    throw new Exception("Membership does not exist");
//                }

//                _unitOfWork.Repository<Membership>().Delete(membership);
//                await _unitOfWork.CompleteAsync();
//                return true;
//            }
//            catch (DbUpdateException dbEx)
//            {
//                _logger.LogError(dbEx, "Database error while deleting membership with ID: {Id} !", id);
//                throw new Exception(dbEx.Message);
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error while deleting membership with ID: {Id}", id);
//                throw;
//            }
//        }



//        public async Task<User> GetUserByIdAsync(string userId)
//        {
//            return await _unitOfWork.Repository<User>().GetByIdAsync(userId);
//        }

//        public async Task<bool> AssignMembershipToUserAsync(string userId, string membershipId)
//        {
//            var user = await _unitOfWork.Repository<User>().GetByIdAsync(userId);
//            if (user == null) return false;

//            user.MembershipId = membershipId;

//            _unitOfWork.Repository<User>().Update(user);
//            await _unitOfWork.CompleteAsync();
//            return true;
//        }


//        public async Task<MembershipDTORead> GetUserMembershipAsync(string userId)
//        {
//            // 1. Get the user first
//            var user = await _userService.GetUserByIdAsync(userId);

//            // 2. Check if user exists and has membership
//            if (user?.MembershipId == null)
//            {
//                return null;
//            }

//            // 3. Get the membership details
//            return await GetByIdAsync(user.MembershipId);
//        }

//    }
//}

using Application.DTOs.Memberships;
using Application.Interfaces.IUnitOfWork;
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

        public async Task<bool> CreateAsync(MembershipDTOCreate membershipDTO)
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

        public async Task<List<MembershipDTORead>> GetAllAsync()
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

        public async Task<MembershipDTORead> GetByIdAsync(string id)
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

                membership.Title = membershipDTO.Title;
                membership.Price = membershipDTO.Price;
                membership.IncludesVAT = membershipDTO.IncludesVAT;
                membership.BillingType = membershipDTO.BillingType;
                membership.Description = membershipDTO.Description;
                membership.AdditionalServices = membershipDTO.AdditionalServices;
                membership.Created_At = membershipDTO.Created_At;
                membership.isActive = membershipDTO.isActive;

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

        public async Task<bool> DeleteAsync(string id)
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

            user.MembershipId = membershipId;
            _unitOfWork.Repository<User>().Update(user);
            await _unitOfWork.CompleteAsync();
            return true;
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

            return await GetByIdAsync(user.MembershipId);

        }
        //public async Task<MembershipDTORead> GetUserMembershipAsync(string userId)
        //{
        //    _logger.LogInformation($"[STEP 1] Testing GetUserMembershipAsync for userId: {userId}");

        //    var user = await GetUserByIdAsync(userId);

        //    if (user == null)
        //    {
        //        _logger.LogWarning($"[STEP 1] User with ID {userId} not found.");
        //        throw new Exception($"User with ID {userId} not found.");
        //    }

        //    _logger.LogInformation($"[STEP 1] Found user: {user.FirstName} {user.LastName}");

        //    return null;
        //}

    }
    }