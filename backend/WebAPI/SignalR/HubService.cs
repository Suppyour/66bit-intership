using Application.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace WebAPI.SignalR;

public class HubService : IHubService
{
    private readonly IHubContext<HubR> _hubContext;

    public HubService(IHubContext<HubR> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task Change(string message)
    {
        await _hubContext.Clients.All.SendAsync("ReceiveMessage", message);
    }
}