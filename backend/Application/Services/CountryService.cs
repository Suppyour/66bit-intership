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
            c.Name,
            c.CreatedDate,
            c.ModifiedDate
        )).ToList();

        return dtos;
    }

    public async Task UpdateCountryAsync(CountryDto dto)
    {
        var country = await _repository.GetByIdAsync(dto.Id);
        if (country == null) return;

        country.Name = dto.Name;

        await _repository.UpdateAsync(country);
    }

    public async Task DeleteCountryAsync(Guid id)
    {
        var country = await _repository.GetByIdAsync(id);
        if (country != null)
        {
            await _repository.DeleteAsync(country);
        }
    }

    public async Task<CountryDto?> GetCountryByIdAsync(Guid id)
    {
        var c = await _repository.GetByIdAsync(id);
        if (c == null) return null;

        return new CountryDto(
            c.Id,
            c.Name,
            c.CreatedDate,
            c.ModifiedDate
        );
    }
}