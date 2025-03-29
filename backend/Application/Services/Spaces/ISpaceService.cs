using Application.DTOs.Spaces;
using Domain.Spaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.ISpaceServices
{
    public interface ISpaceService
    {
        Task<SpaceDTORead> GetSpaceById(string id);
        Task<IEnumerable<SpaceDTORead>> GetAllSpaces();
        Task CreateSpaceAsync(SpaceDTOCreate spaceDTO);
        Task<bool> DeleteSpaceAsync(string id);
        Task<Space> UpdateSpaceAsync(string id,SpaceDTOUpdate spaceDTO);

    }
}
