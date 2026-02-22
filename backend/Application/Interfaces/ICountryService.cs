using Application.DTOs;

namespace Application.Interfaces;

public interface ICountryService
{
    Task<Guid> CreateCountryAsync(CountryDto dto);
    Task UpdateCountryAsync(CountryDto dto);
    Task DeleteCountryAsync(Guid id);
    Task<CountryDto?> GetCountryByIdAsync(Guid id);
    Task<List<CountryDto>> GetAllCountriesAsync();
}
