namespace Application.DTOs;

public record ManufacturerDto(
    Guid Id, 
    string Name, 
    string Description, 
    DateTime CreatedAt, 
    DateTime? UpdatedAt);
