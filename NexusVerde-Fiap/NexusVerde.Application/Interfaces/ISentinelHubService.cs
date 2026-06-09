namespace NexusVerde.Application.Interfaces;

/// <summary>
/// Interface para integração com Sentinel Hub API
/// </summary>
public interface ISentinelHubService
{
    /// <summary>
    /// Obtém token de autenticação do Sentinel Hub
    /// </summary>
    Task<string> ObterTokenAsync();
    
    /// <summary>
    /// Busca imagem ou estatísticas de uma região
    /// </summary>
    Task<object?> SolicitarImagemAsync(decimal latitude, decimal longitude, DateTime data);
    
    /// <summary>
    /// Obtém estatísticas NDVI de uma região
    /// </summary>
    Task<Dictionary<string, decimal>> ObterEstatisticasNdviAsync(decimal latitude, decimal longitude, DateTime data);
    
    /// <summary>
    /// Simula uma análise com dados fictícios (para testes sem credenciais)
    /// </summary>
    Task<Dictionary<string, decimal>> SimularAnaliseAsync(decimal latitude, decimal longitude);
}

