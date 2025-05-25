using Application.DTOs.Spaces;
using Application.Services.ISpaceServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace Api.Space
{
    [ApiController]
    [Route("[controller]")]
    public class SpaceController : ControllerBase
    {
        private readonly ISpaceService _spaceService;
        private readonly ILogger<SpaceController> _logger;

        public SpaceController(ISpaceService spaceService, ILogger<SpaceController> logger)
        {
            _spaceService = spaceService;
            _logger = logger;
        }

        [HttpGet("Hi")]
        public IActionResult getHi()
        {
            return Ok();
        }

        [HttpGet("{id}", Name = "GetSpaceById")]
        public async Task<IActionResult> GetSpaceById(string id)
        {
            try
            {
                var space = await _spaceService.GetSpaceByIdAsync(id);
                if (space == null)
                {
                    return NotFound("Space not found.");
                }
                return Ok(space);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetSpaceByIdAsync method: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet(Name = "GetAllSpaces")]
        public async Task<IActionResult> GetAllSpaces()
        {
            try
            {
                var spaces = await _spaceService.GetAllSpacesAsync();
                return Ok(spaces);

            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetAllSpacesAsync method: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost(Name = "CreateSpace")]
        public async Task<IActionResult> CreateSpace([FromForm] SpaceDTOCreate spaceDto,IFormFile image)
        {
            try
            {
                var response = await _spaceService.CreateSpaceAsync(spaceDto, image);
                return Ok(response);

            }
            catch(Exception ex)
            {
                _logger.LogError($"Error in CreateSpaceAsync method : {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}",Name = "UpdateSpace")]
        public async Task<IActionResult> UpdateSpace(string id, [FromForm] SpaceDTOUpdate spaceDto)
        {
            try
            {
                var space = await _spaceService.UpdateSpaceAsync(id, spaceDto);
                return Ok(space);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in UpdateSpaceAsync method : {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
            
        }

        [HttpDelete("{id}",Name = "DeleteSpace")]
        public async Task<IActionResult> DeleteSpace(string id)
        {
            try
            {
                await _spaceService.DeleteSpaceAsync(id);
                return Ok("Space deleted successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in DeleteSpaceAsync method: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
