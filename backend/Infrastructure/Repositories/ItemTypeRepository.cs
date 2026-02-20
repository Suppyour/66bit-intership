using Application.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ItemTypeRepository : IItemTypeRepository
{
    private readonly AppDbContext _context;

    public ItemTypeRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(ItemType itemType)
    {
        _context.ItemTypes.Add(itemType);
        await _context.SaveChangesAsync();
    }

    public async Task<List<ItemType>> GetAllAsync()
    {
        return await _context.ItemTypes.ToListAsync();
    }

    public async Task DeleteAsync(ItemType itemType)
    {
        _context.ItemTypes.Remove(itemType);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(ItemType itemType)
    {
        _context.ItemTypes.Update(itemType);
        await _context.SaveChangesAsync();
    }

    public async Task<ItemType?> GetByIdAsync(Guid id)
    {
        return await _context.ItemTypes.FindAsync(id);
    }
}