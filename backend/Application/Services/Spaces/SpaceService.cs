using Application.DTOs.Spaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Services.ISpaceServices;
using Domain.Spaces;
using Application.Interfaces.IUnitOfWork;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http.Internal;
using Application.Services.ImgurUploaderService;
using Microsoft.AspNetCore.Http;
using System.Diagnostics;
using System.Xml.Linq;

namespace Application.Services.Spaces
{
    public class SpaceService : ISpaceService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<SpaceService> _logger;

        public SpaceService(IUnitOfWork unitOfWork, ILogger<SpaceService> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<bool> CreateSpaceAsync(SpaceDTOCreate spaceDTO,IFormFile imageFile)
        {
            try
            {
                _logger.LogInformation("Creating a new space with Name: {Name}", spaceDTO.Name);

                var space = new Space
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = spaceDTO.Name,
                    Type = spaceDTO.Type,
                    Description = spaceDTO.Description,
                    Capacity = spaceDTO.Capacity,
                    Price = spaceDTO.Price,
                    Location = spaceDTO.Location,
                    Image_URL = null
                };

            if (imageFile != null)
                {
                    if (imageFile.Length > 0)
                    {
                        var tempFilePath = Path.GetTempFileName();
                        using (var stream = new FileStream(tempFilePath, FileMode.Create))
                        {
                            await imageFile.CopyToAsync(stream);
                        }
                        var imageUrl = await ImageUploaderService.UploadToImgur(tempFilePath, "YOUR_API_KEY");
                    
                        

                        space.Image_URL = imageUrl;
                        System.IO.File.Delete(tempFilePath);
                    }
                }

                

                _unitOfWork.Repository<Space>().Create(space);
                await _unitOfWork.CompleteAsync();
                _logger.LogInformation("Space created successfully with ID: {Id}", space.Id);
                return true;
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while creating space with Name: {Name}", spaceDTO.Name);
                throw new Exception("Database error!" + dbEx.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while creating space with Name: {Name}", spaceDTO.Name);
                throw;
            }
        }

        public async Task<IEnumerable<SpaceDTORead>> GetAllSpacesAsync()
        {
            try
            {
                _logger.LogInformation("Fetching all spaces from the database.");

                var spaces = await _unitOfWork.Repository<Space>().GetAllAsync();

                var spaceDTOs = spaces.Select(s => new SpaceDTORead
                {
                    Id = s.Id,
                    Capacity = s.Capacity,
                    Name = s.Name,
                    Location = s.Location,
                    Description = s.Description,
                    Price = s.Price,
                    Type = s.Type,
                    Image_URL = s.Image_URL,
                }).ToList();

                _logger.LogInformation("Successfully fetched {Count} spaces from the database.", spaceDTOs.Count);

                return spaceDTOs;
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while retrieving all spaces.");
                throw new Exception(dbEx.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving all spaces.");
                throw;
            }
        }

        public async Task<SpaceDTORead> GetSpaceByIdAsync(string id)
        {
            try
            {
                _logger.LogInformation("Fetching space with ID: {Id}", id);

                var space = await _unitOfWork.Repository<Space>().GetByIdAsync(id);

                if (space == null)
                {
                    _logger.LogWarning("Space with ID {Id} not found.", id);
                    return null;
                }

                _logger.LogInformation("Successfully fetched space with ID: {Id}", id);

                return new SpaceDTORead
                {
                    Id = space.Id,
                    Image_URL = space.Image_URL,
                    Name = space.Name,
                    Location = space.Location,
                    Description = space.Description,
                    Price = space.Price,
                    Type = space.Type,
                    Capacity = space.Capacity
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

        public async Task<bool> UpdateSpaceAsync(string id, SpaceDTOUpdate spaceDTOUpdate)
        {
            try 
            {
                _logger.LogInformation("Updating space with ID: {Id}", id);

                var image = spaceDTOUpdate.image;

                var space = await _unitOfWork.Repository<Space>().GetByIdAsync(id);

                var spaces = spaceDTOUpdate;

                if (space != null) 
                {
                    if(spaceDTOUpdate.Name != "null")
                    {
                        space.Name = spaceDTOUpdate.Name;
                    }
                    if(spaceDTOUpdate.Location != "null")
                    {
                        space.Location = spaceDTOUpdate.Location;
                    }
                    if (spaceDTOUpdate.Description != "null")
                    {
                        space.Description = spaceDTOUpdate.Description;
                    }
                    if (spaceDTOUpdate.Capacity != null)
                    {
                        space.Capacity = (int)spaceDTOUpdate.Capacity;
                    }
                    if (spaceDTOUpdate.Price != null)
                    {
                        space.Price = (double)spaceDTOUpdate.Price;
                    }
                    if(spaceDTOUpdate.Type  != "null")
                    {
                        space.Type = spaceDTOUpdate.Type;
                    }
                    
                  
                    space.Image_URL = space.Image_URL;

                    if (image != null)
                    {
                        if (image.Length > 0)
                        {
                            var tempFilePath = Path.GetTempFileName();
                            using (var stream = new FileStream(tempFilePath, FileMode.Create))
                            {
                                await image.CopyToAsync(stream);
                            }
                            var imageUrl = await ImageUploaderService.UploadToImgur(tempFilePath, "YOUR_API_KEY");
                            space.Image_URL = imageUrl;
                            System.IO.File.Delete(tempFilePath);
                        }
                    }

                    _unitOfWork.Repository<Space>().Update(space);
                    await _unitOfWork.CompleteAsync();

                    _logger.LogInformation("Successfully updated space with ID: {Id}", id);

                    return true;
                }
                return false;
                
            }
            catch(DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while updating space with ID: {Id} !", id);
                throw new Exception(dbEx.Message);
            }

            catch(Exception ex)
            {
                _logger.LogError(ex, "Error while updating space with ID: {Id}", id);
                throw;
            }
            
        }

        public async Task<bool> DeleteSpaceAsync(string id)
        {
            try
            {
                var space = await _unitOfWork.Repository<Space>().GetByIdAsync(id);

                if (space == null)
                {

                    throw new Exception("Space does not exist");
                }

                _unitOfWork.Repository<Space>().Delete(space);
                await _unitOfWork.CompleteAsync();
                return true;
            }
            catch(DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while deleting space with ID: {Id} !", id);
                throw new Exception(dbEx.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while deleting space with ID: {Id}", id);
                throw;
            }

            
        }
    }
}
