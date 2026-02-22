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

    public async Task UpdateItemTypeAsync(ItemTypeDto dto)
    {
        var itemType = await _repository.GetByIdAsync(dto.Id);
        if (itemType == null) return;

        itemType.Name = dto.Name;
        itemType.Description = dto.Description;

        await _repository.UpdateAsync(itemType);
    }

    public async Task DeleteItemTypeAsync(Guid id)
    {
        var itemType = await _repository.GetByIdAsync(id);
        if (itemType != null)
        {
            await _repository.DeleteAsync(itemType);
        }
    }

    public async Task<ItemTypeDto?> GetItemTypeByIdAsync(Guid id)
    {
        var i = await _repository.GetByIdAsync(id);
        if (i == null) return null;

        return new ItemTypeDto(
            i.Id,
            i.Name,
            i.Description,
            i.CreatedDate,
            i.ModifiedDate
        );
    }
}