namespace Application.DTOs;

public record ItemDto(
    Guid Id,
    string PhotoUrl,
    string Model,
    decimal Price,
    string Manufacturer,
    string ItemType,
    string Country
);
