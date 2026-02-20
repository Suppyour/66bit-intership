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
}