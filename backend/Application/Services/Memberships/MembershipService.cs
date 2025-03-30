using Application.DTOs.Memberships;
using Application.Interfaces.IUnitOfWork;
using Domain.Memberships;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
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

        public async Task<IEnumerable<MembershipDTORead>> GetAllMemberships()
        {
            _logger.LogInformation("Fetching all memberships.");
            var memberships = await _unitOfWork.Repository<Membership>().GetAllAsync();

            return memberships.Select(m => new MembershipDTORead
            {
                Id = m.Id,
                Type = m.Type,
                StartDate = m.StartDate,
                EndDate = m.EndDate,
                Price = (double)m.Price,
                Status = m.Status,
                UserId = m.UserId
            }).ToList();
        }

        public async Task<MembershipDTORead> GetMembershipById(string id)
        {
            _logger.LogInformation("Fetching membership with ID: {Id}", id);
            var membership = await _unitOfWork.Repository<Membership>().GetById(id).FirstOrDefaultAsync();

            if (membership == null)
            {
                _logger.LogWarning("Membership with ID {Id} not found.", id);
                return null;
            }

            return new MembershipDTORead
            {
                Id = membership.Id,
                Type = membership.Type,
                StartDate = membership.StartDate,
                EndDate = membership.EndDate,
                Price = (double)membership.Price,
                Status = membership.Status,
                UserId = membership.UserId
            };
        }

        public async Task CreateMembershipAsync(MembershipDTOCreate membershipDTO)
        {
            _logger.LogInformation("Creating a new membership for UserId: {UserId}", membershipDTO.UserId);

            var membership = new Membership
            {
                Id = Guid.NewGuid().ToString(),
                UserId = membershipDTO.UserId,
                Type = membershipDTO.Type,
                StartDate = DateTime.UtcNow,
                EndDate = CalculateEndDate(membershipDTO.Type),
                Price = membershipDTO.Price,
                Status = "Active"
            };

            _unitOfWork.Repository<Membership>().Create(membership);
            await _unitOfWork.CompleteAsync();
            _logger.LogInformation("Membership created successfully with ID: {Id}", membership.Id);
        }

        public async Task<Membership> UpdateMembershipAsync(MembershipDTOUpdate membershipDTO)
        {
            _logger.LogInformation("Updating membership with ID: {Id}", membershipDTO.Id);
            var membership = await _unitOfWork.Repository<Membership>().GetById(membershipDTO.Id).FirstOrDefaultAsync();

            if (membership == null)
            {
                _logger.LogWarning("Cannot update. Membership with ID {Id} not found.", membershipDTO.Id);
                return null;
            }

            membership.Type = membershipDTO.Type;
            membership.Status = membershipDTO.Status;
            membership.EndDate = CalculateEndDate(membershipDTO.Type);

            _unitOfWork.Repository<Membership>().Update(membership);
            await _unitOfWork.CompleteAsync();
            _logger.LogInformation("Successfully updated membership with ID: {Id}", membershipDTO.Id);

            return membership;
        }

        public async Task<bool> DeleteMembershipAsync(string id)
        {
            _logger.LogInformation("Deleting membership with ID: {Id}", id);
            var membership = await _unitOfWork.Repository<Membership>().GetById(id).FirstOrDefaultAsync();

            if (membership == null)
            {
                _logger.LogWarning("Membership with ID {Id} not found.", id);
                return false;
            }

            _unitOfWork.Repository<Membership>().Delete(membership);
            await _unitOfWork.CompleteAsync();
            _logger.LogInformation("Membership with ID: {Id} deleted successfully.", id);
            return true;
        }

        private DateTime CalculateEndDate(string type)
        {
            return type.ToLower() switch
            {
                "monthly" => DateTime.UtcNow.AddMonths(1),
                "yearly" => DateTime.UtcNow.AddYears(1),
                _ => throw new ArgumentException("Invalid membership type")
            };
        }
    }
}
