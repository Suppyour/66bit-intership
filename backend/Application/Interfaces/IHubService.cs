namespace Application.Interfaces;

public interface IHubService
{
    Task Change(string message);
}