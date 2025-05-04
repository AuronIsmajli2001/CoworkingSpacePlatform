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
                var space = await _spaceService.GetSpaceById(id);
                if (space == null)
                {
                    return NotFound("Space not found.");
                }
                return Ok(space);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetSpaceById method: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet(Name = "GetAllSpaces")]
        public async Task<IActionResult> GetAllSpaces()
        {
            try
            {
                var spaces = await _spaceService.GetAllSpaces();
                var spaceDto = spaces.Select(spaces => new SpaceDTOCreate {
                    Name = spaces.Name,
                    Type = spaces.Type,
                    Capacity = spaces.Capacity,
                    Description = spaces.Description,
                    Location = spaces.Location,
                    Price = spaces.Price,
                }).ToList();

                return Ok(spaces);

            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetAllSpaces method: {ex.Message}");
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
                _logger.LogError($"Error in CreateSpace method : {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}",Name = "UpdateSpace")]
        public async Task<IActionResult> UpdateSpace(string id, [FromForm] SpaceDTOUpdate spaceDto,IFormFile image)
        {
            try
            {
                var space = await _spaceService.UpdateSpaceAsync(id, spaceDto,image);
                return Ok(space);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in UpdateSpace method : {ex.Message}");
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
                _logger.LogError($"Error in DeleteSpace method: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
