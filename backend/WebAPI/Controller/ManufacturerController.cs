using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ManufacturerController : ControllerBase
{
    private readonly IManufacturerService _service;

    public ManufacturerController(IManufacturerService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ManufacturerDto dto)
    {
        var id = await _service.CreateManufacturerAsync(dto);
        return Ok(id);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllManufacturersAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetManufacturerByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] ManufacturerDto dto)
    {
        if (id != dto.Id) return BadRequest("ID mismatch");
        await _service.UpdateManufacturerAsync(dto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteManufacturerAsync(id);
        return NoContent();
    }
}