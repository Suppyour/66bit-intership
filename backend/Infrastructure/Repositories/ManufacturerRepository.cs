using Application.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ManufacturerRepository : IManufacturerRepository
{
    private readonly AppDbContext _context;

    public ManufacturerRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Manufacturer manufacturer)
    {
        _context.Manufacturers.Add(manufacturer);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Manufacturer>> GetAllAsync()
    {
        return await _context.Manufacturers.ToListAsync();
    }

    public async Task DeleteAsync(Manufacturer manufacturer)
    {
        _context.Manufacturers.Remove(manufacturer);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Manufacturer manufacturer)
    {
        _context.Manufacturers.Update(manufacturer);
        await _context.SaveChangesAsync();
    }

    public async Task<Manufacturer?> GetByIdAsync(Guid id)
    {
        return await _context.Manufacturers.FindAsync(id);
    }
}
