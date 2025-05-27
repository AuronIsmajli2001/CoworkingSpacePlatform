using Application.DTOs.Spaces;
using Domain.Spaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.ISpaceServices
{
    public interface ISpaceService
    {
        Task<SpaceDTORead> GetSpaceByIdAsync(string id);
        Task<IEnumerable<SpaceDTORead>> GetAllSpacesAsync();
        Task<bool> CreateSpaceAsync(SpaceDTOCreate spaceDTO,IFormFile image);
        Task<bool> DeleteSpaceAsync(string id);
        Task<bool> UpdateSpaceAsync(string id,SpaceDTOUpdate spaceDTO);

    }
}
