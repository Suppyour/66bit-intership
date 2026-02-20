using Application.DTOs;
using Application.Interfaces;
using Domain;
using System.Linq;

namespace Application.Services;

public class ItemTypeService : IItemTypeService
{
    private readonly IItemTypeRepository _repository;

    public ItemTypeService(IItemTypeRepository repository)
    {
        _repository = repository;
    }

    public async Task<Guid> CreateItemTypeAsync(ItemTypeDto dto)
    {
        var itemType = new ItemType
        {
            Name = dto.Name,
            Description = dto.Description
        };

        await _repository.AddAsync(itemType);
        return itemType.Id;
    }

    public async Task<List<ItemTypeDto>> GetAllItemTypesAsync()
    {
        var itemTypes = await _repository.GetAllAsync();

        var dtos = itemTypes.Select(i => new ItemTypeDto(
            i.Id,
            i.Name,
            i.Description,
            i.CreatedDate,
            i.ModifiedDate
        )).ToList();

        return dtos;
    }

    public Task UpdateItemTypeAsync(ItemTypeDto dto)
    {
        throw new NotImplementedException();
    }

    public Task DeleteItemTypeAsync(Guid id)
    {
        throw new NotImplementedException();
    }
}