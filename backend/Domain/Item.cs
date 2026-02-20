namespace Domain;

public class Item : BaseEntity
{
    public string PhotoUrl { get; set; }
    public string Model { get; set; }
    public decimal Price { get; set; }
    public Guid ItemTypeId { get; set; }
    public Guid ManufacturerId { get; set; }
    public Guid CountryId { get; set; }
    public ItemType? ItemType { get; set; }
    public Manufacturer? Manufacturer { get; set; }
    public Country? Country { get; set; }
}