using Application.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class CountryRepository : ICountryRepository
{
    private readonly AppDbContext _context;

    public CountryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Country country)
    {
        _context.Countries.Add(country);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Country>> GetAllAsync()
    {
        return await _context.Countries.ToListAsync();
    }

    public async Task DeleteAsync(Country country)
    {
        _context.Countries.Remove(country);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Country country)
    {
        _context.Countries.Update(country);
        await _context.SaveChangesAsync();
    }

    public async Task<Country?> GetByIdAsync(Guid id)
    {
        return await _context.Countries.FindAsync(id);
    }
}