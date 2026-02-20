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
}
