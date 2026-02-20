using Domain;

namespace Application.DTOs;

public record ItemTypeDto(
    Guid Id, 
    string Name, 
    string Description, 
    DateTime CreatedAt, 
    DateTime? UpdatedAt);