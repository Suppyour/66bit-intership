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

    public Task UpdateManufacturerAsync(ManufacturerDto dto)
    {
        throw new NotImplementedException();
    }

    public Task DeleteManufacturerAsync(Guid id)
    {
        throw new NotImplementedException();
    }
}