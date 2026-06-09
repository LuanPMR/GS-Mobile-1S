using NexusVerde.Application.Interfaces;

namespace NexusVerde.Application.Services;

/// <summary>
/// Serviço de integração com Sentinel Hub (com suporte a simulação para testes)
/// </summary>
public class SentinelHubService : ISentinelHubService
{
    private readonly HttpClient _httpClient;

    public SentinelHubService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<string> ObterTokenAsync()
    {
        return await Task.FromResult("SIMULATED_TOKEN_" + Guid.NewGuid());
    }

    public async Task<object?> SolicitarImagemAsync(decimal latitude, decimal longitude, DateTime data)
    {
        return await Task.FromResult<object?>(new { status = "simulado", data = DateTime.UtcNow });
    }

    public async Task<Dictionary<string, decimal>> ObterEstatisticasNdviAsync(decimal latitude, decimal longitude, DateTime data)
    {
        return await Task.FromResult(new Dictionary<string, decimal>
        {
            { "NDVI", 0.65m },
            { "Vegetacao", 75m },
            { "Solo", 15m }
        });
    }

    public async Task<Dictionary<string, decimal>> SimularAnaliseAsync(decimal latitude, decimal longitude)
    {
        var random = new Random();
        return await Task.FromResult(new Dictionary<string, decimal>
        {
            { "NDVI", (decimal)(random.NextDouble() * 0.9) },
            { "Vegetacao", (decimal)(50 + random.NextDouble() * 40) },
            { "Solo", (decimal)(10 + random.NextDouble() * 30) },
            { "Queimada", (decimal)(random.NextDouble() * 10) }
        });
    }
}




