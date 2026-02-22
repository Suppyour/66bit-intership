using Application.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ItemRepository : IItemRepository
{
    private readonly AppDbContext _context;

    public ItemRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Item item)
    {
        _context.Items.Add(item);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Item>> GetAllFilteredAsync(
        string? searchQuery, decimal? minPrice, decimal? maxPrice, Guid? typeId, Guid? manufacturerId)
    {
        var query = _context.Items
            .Include(i => i.ItemType)
            .Include(i => i.Manufacturer)
            .Include(i => i.Country)
            .AsQueryable();
        
        if (minPrice.HasValue)
        {
            query = query.Where(i => i.Price >= minPrice.Value);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(i => i.Price <= maxPrice.Value);
        }

        if (!string.IsNullOrWhiteSpace(searchQuery))
        {
            var searchLower = searchQuery.ToLower();
            query = query.Where(i => 
                i.Model.ToLower().Contains(searchLower) ||
                i.ItemType.Name.ToLower().Contains(searchLower) ||
                i.Manufacturer.Name.ToLower().Contains(searchLower));
        }

        if (typeId.HasValue)
        {
            query = query.Where(i => i.ItemTypeId == typeId.Value);
        }

        if (manufacturerId.HasValue)
        {
            query = query.Where(i => i.ManufacturerId == manufacturerId.Value);
        }
        return await query.ToListAsync();
    }

    public Task DeleteItemAsync(Item item)
    {
        throw new NotImplementedException();
    }
}