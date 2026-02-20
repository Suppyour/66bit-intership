namespace Application.DTOs;

public class CreateItemDto
{
    public string PhotoUrl { get; set; }
    public string Model { get; set; }
    public decimal Price { get; set; }
    public Guid ItemTypeId{ get; set; }
    public Guid ManufacturerId{ get; set; }
    public Guid? CountryId{ get; set; }
    public string? NewCountryName { get; set; }
}