using Domain;

namespace Application.Interfaces;

public interface IItemTypeRepository
{
    Task AddAsync(ItemType itemType);
    Task<List<ItemType>> GetAllAsync();
    Task<ItemType?> GetByIdAsync(Guid id);
    Task UpdateAsync(ItemType itemType);
    Task DeleteAsync(ItemType itemType);
}