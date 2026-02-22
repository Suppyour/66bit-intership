using Application.DTOs;
using Application.Interfaces;
using Domain;

namespace Application.Services;

public class ItemService : IItemService
{
    private readonly IItemRepository _itemRepository;
    private readonly ICountryRepository _countryRepository;
    private readonly IHubService _hubService;

    public ItemService(IItemRepository itemRepository, ICountryRepository countryRepository, IHubService hubService)
    {
        _itemRepository = itemRepository;
        _countryRepository = countryRepository;
        _hubService = hubService;
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
        await _hubService.Change("Создан новый товар");
        return item.Id;
    }

    public async Task<ItemDto?> GetItemByIdAsync(Guid id)
    {
        var i = await _itemRepository.GetByIdAsync(id);
        if (i == null) return null;
        return new ItemDto(
            i.Id, i.PhotoUrl, i.Model, i.Price,
            i.Manufacturer.Name, i.ItemType.Name, i.Country.Name
        );
    }
    public async Task UpdateItemAsync(Guid id, CreateItemDto dto)
    {
        var item = await _itemRepository.GetByIdAsync(id);
        if (item == null) return;
    
        item.Model = dto.Model;
        item.Price = dto.Price;
        item.PhotoUrl = dto.PhotoUrl;
        item.ItemTypeId = dto.ItemTypeId;
        item.ManufacturerId = dto.ManufacturerId;
        if (dto.CountryId.HasValue) 
            item.CountryId = dto.CountryId.Value;
        await _itemRepository.UpdateAsync(item);
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

    public async Task DeleteItemAsync(Guid id)
    {
        var item = await _itemRepository.GetByIdAsync(id);
        if (item != null)
        {
            await _itemRepository.DeleteItemAsync(item);
            await _hubService.Change($"Удален товар {item.Model}");
        }
    }
}