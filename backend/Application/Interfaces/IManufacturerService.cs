using Application.DTOs;

namespace Application.Interfaces;

public interface IManufacturerService
{
    Task<Guid> CreateManufacturerAsync(ManufacturerDto dto);
    Task UpdateManufacturerAsync(ManufacturerDto dto);
    Task DeleteManufacturerAsync(Guid id);
    Task<List<ManufacturerDto>> GetAllManufacturersAsync();
}