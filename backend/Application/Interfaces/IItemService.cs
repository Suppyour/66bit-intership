using Application.DTOs;
using Domain;

namespace Application.Interfaces;

public interface IItemService
{
    Task<Guid> CreateItemAsync(CreateItemDto item);
    Task DeleteItemAsync(Guid id);
    Task<List<ItemDto>> GetAllFilteredAsync(string? searchQuery, decimal? minPrice, decimal? maxPrice, Guid? typeId, Guid? manufacturerId);
    Task<ItemDto?> GetItemByIdAsync(Guid id);
    Task UpdateItemAsync(Guid id, CreateItemDto dto);
}