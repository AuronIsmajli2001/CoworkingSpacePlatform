using Application.DTOs.Equipments;
using Application.DTOs.Spaces;
using Application.Interfaces.IUnitOfWork;
using Application.Services.Auth;
using Application.Services.ImgurUploaderService;
using Domain.Equipments;
using Domain.Spaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace Application.Services.Equipments
{
    public class EquipmentService : IEquipmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<EquipmentService> _logger;
        public EquipmentService(IUnitOfWork unitOfWork,ILogger<EquipmentService> logger,IAuthService authService) 
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<string> CreateEquipmentAsync(EquipmentDTOCreate equipmentDTO)
        {
            try
            {
                _logger.LogInformation("Creating a new Equipment with Name: {Name}", equipmentDTO.Name);

                var equipment = new Equipment
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = equipmentDTO.Name,
                    Type = equipmentDTO.Type,
                    Quantity = equipmentDTO.Quantity,
                    Price_per_piece = equipmentDTO.Price_per_piece
                };
                _unitOfWork.Repository<Equipment>().Create(equipment);
                await _unitOfWork.CompleteAsync();
                _logger.LogInformation("Equipment created successfully with ID: {Id}", equipment.Id);
                return "Equipment created successfully!";
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while creating equipment with Name: {Name}", equipmentDTO.Name);
                throw new Exception("Database error!" + dbEx.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while creating equipment with Name: {Name}", equipmentDTO.Name);
                throw;
            }
        }

        public async Task<bool> DeleteEquipmentAsync(string id)
        {
            try
            {
                var equipment = await _unitOfWork.Repository<Equipment>().GetByIdAsync(id);

                if (equipment == null)
                {
                    throw new Exception("This Equipment does not exist");
                }

                _unitOfWork.Repository<Equipment>().Delete(equipment);
                await _unitOfWork.CompleteAsync();
                return true;
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while deleting equipment with ID: {Id} !", id);
                throw new Exception(dbEx.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while deleting equipment with ID: {Id}", id);
                throw;
            }
        }

        public async Task<IEnumerable<EquipmentDTORead>> GetAllEquipmentAsync()
        {
            try
            {
                _logger.LogInformation("Fetching all equipments from the database.");

                var equipments = await _unitOfWork.Repository<Equipment>().GetAllAsync();

                var equipmentsDTOs = equipments.Select(s => new EquipmentDTORead
                {
                    Id = s.Id,
                    Name = s.Name,
                    Type = s.Type,
                    Price_per_piece = s.Price_per_piece,
                    Quantity = s.Quantity,
                    //Lists
                }).ToList();

                _logger.LogInformation("Successfully fetched {Count} equipments from the database.", equipmentsDTOs.Count);

                return equipmentsDTOs;
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while retrieving all equipments.");
                throw new Exception(dbEx.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving all equipments.");
                throw;
            }
        }

        public async Task<EquipmentDTORead> GetEquipmentByIdAsync(string id)
        {
            try
            {
                _logger.LogInformation("Fetching equipment with ID: {Id}", id);

                var equipment = await _unitOfWork.Repository<Equipment>().GetByIdAsync(id);

                if (equipment == null)
                {
                    _logger.LogWarning("Equipment with ID {Id} not found.", id);
                    return null;
                }

                _logger.LogInformation("Successfully fetched Equipment with ID: {Id}", id);

                return new EquipmentDTORead
                {
                    Id = equipment.Id,
                    Name = equipment.Name,
                    Type = equipment.Type,
                    Price_per_piece = equipment.Price_per_piece,
                    Quantity = equipment.Quantity,
                    //Lists
                    
                };
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while retrieving space with ID: {Id} !", id);
                throw new Exception(dbEx.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while fetching space with ID: {Id}", id);
                throw;
            }
        }

        public async Task<Equipment> UpdateEquipmentAsync(string id, EquipmentDTOUpdate dto)
        {
            try
            {
                _logger.LogInformation("Updating equipment with ID: {Id}", id);

                var equipment = await _unitOfWork.Repository<Equipment>().GetByIdAsync(id);

                if (equipment == null)
                {
                    _logger.LogWarning("Cannot update. Equipment with ID {Id} not found.", id);
                    return null;
                }

                if(dto.Type == null)
                {
                    dto.Type = equipment.Type;
                }
                if(dto.Name == null)
                {
                    dto.Name = equipment.Name;
                }
                /*if(dto.Price_per_piece == "")*/

                equipment.Name = dto.Name;
                equipment.Type = dto.Type;
                equipment.Quantity = dto.Quantity;
                equipment.Price_per_piece = dto.Price_per_piece;
                

                _unitOfWork.Repository<Equipment>().Update(equipment);
                await _unitOfWork.CompleteAsync();

                _logger.LogInformation("Successfully updated space with ID: {Id}", id);

                return equipment;
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while updating space with ID: {Id} !", id);
                throw new Exception(dbEx.Message);
            }

            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while updating space with ID: {Id}", id);
                throw;
            }
        }
    }
}
