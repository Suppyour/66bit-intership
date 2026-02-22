using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CountryController : ControllerBase
{
    private readonly ICountryService _service;

    public CountryController(ICountryService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CountryDto dto)
    {
        var id = await _service.CreateCountryAsync(dto);
        return Ok(id);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllCountriesAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetCountryByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CountryDto dto)
    {
        if (id != dto.Id) return BadRequest("ID mismatch");
        await _service.UpdateCountryAsync(dto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteCountryAsync(id);
        return NoContent();
    }
}
