namespace Application.DTOs;

public record CountryDto(
    Guid Id, 
    string Name,
    DateTime CreatedAt, 
    DateTime? UpdatedAt);
