namespace Domain;

public record Country
{
    public Guid Id { get; set; }
    public string Name { get; set; }
}