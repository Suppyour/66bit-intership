using Application.DTOs;
using Application.Interfaces;
using Domain;
using System.Linq;

namespace Application.Services;

public class CountryService : ICountryService
{
    private readonly ICountryRepository _repository;

    public CountryService(ICountryRepository repository)
    {
        _repository = repository;
    }

    public async Task<Guid> CreateCountryAsync(CountryDto dto)
    {
        var country = new Country
        {
            Name = dto.Name
        };

        await _repository.AddAsync(country);
        return country.Id;
    }

    public async Task<List<CountryDto>> GetAllCountriesAsync()
    {
        var countries = await _repository.GetAllAsync();

        var dtos = countries.Select(c => new CountryDto(
            c.Id,
            c.Name
        )).ToList();

        return dtos;
    }

    public Task UpdateCountryAsync(CountryDto dto)
    {
        throw new NotImplementedException();
    }

    public Task DeleteCountryAsync(Guid id)
    {
        throw new NotImplementedException();
    }
}