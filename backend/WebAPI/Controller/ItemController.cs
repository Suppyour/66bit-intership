using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controller;

[ApiController]
[Route("api/[controller]")]
public class ItemController : ControllerBase
{
    private readonly IItemService _service;

    public ItemController(IItemService service)
    {
        _service = service;
    }
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateItemDto dto)
    {
        var id = await _service.CreateItemAsync(dto);
        return Ok(id); 
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? searchQuery, 
        [FromQuery] decimal? minPrice, 
        [FromQuery] decimal? maxPrice, 
        [FromQuery] Guid? typeId, 
        [FromQuery] Guid? manufacturerId)
    {
        var result = await _service.GetAllFilteredAsync(searchQuery, minPrice, maxPrice, typeId, manufacturerId);
        
        return Ok(result);
    }
}