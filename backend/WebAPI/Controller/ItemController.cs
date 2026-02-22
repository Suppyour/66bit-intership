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
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetItemByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateItemDto dto)
    {
        await _service.UpdateItemAsync(id, dto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteItemAsync(id);
        return NoContent();
    }

}