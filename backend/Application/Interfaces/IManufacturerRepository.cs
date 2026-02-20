using Domain;

namespace Application.Interfaces;

public interface IManufacturerRepository
{
    Task AddAsync(Manufacturer manufacturer);
    Task<List<Manufacturer>> GetAllAsync();
    Task<Manufacturer?> GetByIdAsync(Guid id);
    Task UpdateAsync(Manufacturer manufacturer);
    Task DeleteAsync(Manufacturer manufacturer);
}