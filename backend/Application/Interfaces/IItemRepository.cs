using Application.DTOs;
using Domain;

namespace Application.Interfaces;

public interface IItemRepository
{
    Task AddAsync(Item item);
    
    Task<List<Item>> GetAllFilteredAsync(
        string? searchQuery, 
        decimal? minPrice, 
        decimal? maxPrice,
        Guid? typeId,
        Guid? manufacturerId);
    Task DeleteItemAsync(Item item);
}
    