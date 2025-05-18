using Application.DTOs.Memberships;
using Application.Interfaces;
using Application.Interfaces.IUnitOfWork;
using Application.Interfaces.Repository;
using Domain.Memberships;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Services.Memberships
{
    public class MembershipService : IMembershipService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<MembershipService> _logger;

        public MembershipService(IUnitOfWork unitOfWork, ILogger<MembershipService> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<MembershipDTORead> CreateAsync(MembershipDTOCreate membershipDTO)
        {
            try
            {
                var membership = new Membership
                {
                    Title = membershipDTO.Title,
                    Price = membershipDTO.Price,
                    IncludesVAT = membershipDTO.IncludesVAT,
                    BillingType = membershipDTO.BillingType,
                    Description = membershipDTO.Description,
                    AdditionalServices = membershipDTO.AdditionalServices
                };

                await _unitOfWork.Memberships.CreateAsync(membership);
                await _unitOfWork.CompleteAsync();

                return new MembershipDTORead
                {
                    Id = membership.Id,
                    Title = membership.Title,
                    Price = membership.Price,
                    IncludesVAT = membership.IncludesVAT,
                    BillingType = membership.BillingType,
                    Description = membership.Description,
                    AdditionalServices = membership.AdditionalServices
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating membership");
                throw;
            }
        }

        public async Task<IEnumerable<MembershipDTORead>> GetAllAsync()
        {
            var memberships = await _unitOfWork.Memberships.GetAllAsync();
            var result = new List<MembershipDTORead>();

            foreach (var m in memberships)
            {
                result.Add(new MembershipDTORead
                {
                    Id = m.Id,
                    Title = m.Title,
                    Price = m.Price,
                    IncludesVAT = m.IncludesVAT,
                    BillingType = m.BillingType,
                    Description = m.Description,
                    AdditionalServices = m.AdditionalServices
                });
            }

            return result;
        }

        public async Task<MembershipDTORead> GetByIdAsync(int id)
        {
            var membership = await _unitOfWork.Memberships.GetByIdAsync(id.ToString());
            if (membership == null) return null;

            return new MembershipDTORead
            {
                Id = membership.Id,
                Title = membership.Title,
                Price = membership.Price,
                IncludesVAT = membership.IncludesVAT,
                BillingType = membership.BillingType,
                Description = membership.Description,
                AdditionalServices = membership.AdditionalServices
            };
        }

        public async Task UpdateAsync(MembershipDTOUpdate membershipDTO)
        {
            var existing = await _unitOfWork.Memberships.GetByIdAsync(membershipDTO.Id.ToString());
            if (existing == null) throw new Exception("Membership not found");

            if (!string.IsNullOrEmpty(membershipDTO.Title)) existing.Title = membershipDTO.Title;
            if (!string.IsNullOrEmpty(membershipDTO.Price)) existing.Price = membershipDTO.Price;
            if (membershipDTO.IncludesVAT.HasValue) existing.IncludesVAT = membershipDTO.IncludesVAT.Value;
            if (!string.IsNullOrEmpty(membershipDTO.BillingType)) existing.BillingType = membershipDTO.BillingType;
            if (!string.IsNullOrEmpty(membershipDTO.Description)) existing.Description = membershipDTO.Description;
            if (!string.IsNullOrEmpty(membershipDTO.AdditionalServices)) existing.AdditionalServices = membershipDTO.AdditionalServices;

            _unitOfWork.Memberships.Update(existing);
            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var membership = await _unitOfWork.Memberships.GetByIdAsync(id); // ✅ Use int directly

            if (membership == null)
                throw new Exception("Membership not found");

            _unitOfWork.Memberships.Delete(membership);
            await _unitOfWork.CompleteAsync();
        }

    }
}