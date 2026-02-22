using Application.DTOs;
using Application.Interfaces;
using Domain;

namespace Application.Services;

public class ItemService : IItemService
{
    private readonly IItemRepository _itemRepository;
    private readonly ICountryRepository _countryRepository;

    public ItemService(IItemRepository itemRepository, ICountryRepository countryRepository)
    {
        _itemRepository = itemRepository;
        _countryRepository = countryRepository;
    }

    public async Task<Guid> CreateItemAsync(CreateItemDto dto)
    {
        Guid? finalCountryId = dto.CountryId;

        if (!string.IsNullOrWhiteSpace(dto.NewCountryName))
        {
            var newCountry = new Country { Name = dto.NewCountryName };
            await _countryRepository.AddAsync(newCountry);

            finalCountryId = newCountry.Id;
        }

        if (finalCountryId == null)
            throw new ArgumentException("Нужно указать CountryId или NewCountryName");

        var item = new Item
        {
            PhotoUrl = dto.PhotoUrl,
            Model = dto.Model,
            Price = dto.Price,
            ItemTypeId = dto.ItemTypeId,
            ManufacturerId = dto.ManufacturerId,
            CountryId = finalCountryId.Value
        };

        await _itemRepository.AddAsync(item);
        return item.Id;
    }

    public async Task<List<ItemDto>> GetAllFilteredAsync(
        string? searchQuery, decimal? minPrice, decimal? maxPrice, Guid? typeId, Guid? manufacturerId)
    {
        var items = await _itemRepository.GetAllFilteredAsync(searchQuery, minPrice, maxPrice, typeId, manufacturerId);

        var dtos = items.Select(i => new ItemDto(
            i.Id,
            i.PhotoUrl,
            i.Model,
            i.Price,
            i.Manufacturer.Name,
            i.ItemType.Name,
            i.Country.Name
        )).ToList();

        return dtos;
    }

    public Task DeleteItemAsync(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task UpdateItemAsync(Guid id)
    {
        throw new NotImplementedException();
    }
}