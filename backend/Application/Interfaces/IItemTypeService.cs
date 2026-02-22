using Application.DTOs;

namespace Application.Interfaces;

public interface IItemTypeService
{
    Task<Guid> CreateItemTypeAsync(ItemTypeDto dto);
    Task UpdateItemTypeAsync(ItemTypeDto dto);
    Task DeleteItemTypeAsync(Guid id);
    Task<ItemTypeDto?> GetItemTypeByIdAsync(Guid id);
    Task<List<ItemTypeDto>> GetAllItemTypesAsync();
}