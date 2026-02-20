using Domain;

namespace Application.Interfaces;

public interface ICountryRepository
{
    Task AddAsync(Country country);
    Task<List<Country>> GetAllAsync();
    Task<Country?> GetByIdAsync(Guid id);
    Task UpdateAsync(Country country);
    Task DeleteAsync(Country country);
}
