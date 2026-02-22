using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemTypeController : ControllerBase
{
    private readonly IItemTypeService _service;

    public ItemTypeController(IItemTypeService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ItemTypeDto dto)
    {
        var id = await _service.CreateItemTypeAsync(dto);
        return Ok(id);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllItemTypesAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetItemTypeByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] ItemTypeDto dto)
    {
        if (id != dto.Id) return BadRequest("ID mismatch");
        await _service.UpdateItemTypeAsync(dto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteItemTypeAsync(id);
        return NoContent();
    }
}
