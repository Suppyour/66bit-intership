using Application.DTOs;
using Domain;

namespace Application.Interfaces;

public interface IItemService
{
    Task<Guid> CreateItemAsync(CreateItemDto item);
    Task DeleteItemAsync(Guid id);
    Task UpdateItemAsync(Guid id);
}