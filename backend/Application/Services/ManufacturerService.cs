using Application.DTOs;
using Application.Interfaces;
using Domain;
using System.Linq;

namespace Application.Services;

public class ManufacturerService : IManufacturerService
{
    private readonly IManufacturerRepository _repository;

    public ManufacturerService(IManufacturerRepository repository)
    {
        _repository = repository;
    }

    public async Task<Guid> CreateManufacturerAsync(ManufacturerDto dto)
    {
        var manufacturer = new Manufacturer
        {
            Name = dto.Name,
            Description = dto.Description
        };

        await _repository.AddAsync(manufacturer);
        return manufacturer.Id;
    }

    public async Task<List<ManufacturerDto>> GetAllManufacturersAsync()
    {
        var manufacturers = await _repository.GetAllAsync();

        var dtos = manufacturers.Select(m => new ManufacturerDto(
            m.Id,
            m.Name,
            m.Description,
            m.CreatedDate,
            m.ModifiedDate
        )).ToList();

        return dtos;
    }

    public async Task UpdateManufacturerAsync(ManufacturerDto dto)
    {
        var manufacturer = await _repository.GetByIdAsync(dto.Id);
        if (manufacturer == null) return;

        manufacturer.Name = dto.Name;
        manufacturer.Description = dto.Description;

        await _repository.UpdateAsync(manufacturer);
    }

    public async Task DeleteManufacturerAsync(Guid id)
    {
        var manufacturer = await _repository.GetByIdAsync(id);
        if (manufacturer != null)
        {
            await _repository.DeleteAsync(manufacturer);
        }
    }

    public async Task<ManufacturerDto?> GetManufacturerByIdAsync(Guid id)
    {
        var m = await _repository.GetByIdAsync(id);
        if (m == null) return null;

        return new ManufacturerDto(
            m.Id,
            m.Name,
            m.Description,
            m.CreatedDate,
            m.ModifiedDate
        );
    }
}