using NexusVerde.Application.DTOs;
using Microsoft.AspNetCore.Http;

namespace NexusVerde.Application.Interfaces;

/// <summary>
/// Interface para serviço de análise de imagens ambientais com persistência
/// Combina a análise local com salvamento em banco de dados
/// </summary>
public interface IAnaliseImagemAmbientalService
{
    /// <summary>
    /// Analisa uma imagem e salva o resultado no banco de dados
    /// Combina processamento com persistência
    /// </summary>
    // Retorna o resultado detalhado da análise e, quando possível, o resumo salvo no banco (pode ser null se o salvamento falhar)
    Task<(ResultadoAnaliseImagemDto analise, AnaliseImagemAmbientalResponseDto? salva)> AnalisarESalvarAsync(
        IFormFile imagem,
        int? regiaoMonitoradaId = null,
        int linhas = 10,
        int colunas = 10);

    /// <summary>
    /// Obtém todas as análises salvas no banco
    /// </summary>
    Task<IEnumerable<AnaliseImagemAmbientalResponseDto>> ObterTodasAsync();

    /// <summary>
    /// Obtém uma análise específica por ID
    /// </summary>
    Task<AnaliseImagemAmbientalResponseDto?> ObterPorIdAsync(int id);

    /// <summary>
    /// Obtém análises de uma região específica
    /// </summary>
    Task<IEnumerable<AnaliseImagemAmbientalResponseDto>> ObterPorRegiaoAsync(int regiaoId);

    /// <summary>
    /// Obtém análises por nível de risco
    /// </summary>
    Task<IEnumerable<AnaliseImagemAmbientalResponseDto>> ObterPorRiscoAsync(string nivelRisco);

    /// <summary>
    /// Deleta uma análise
    /// </summary>
    Task<bool> DeletarAsync(int id);

    /// <summary>
    /// Obtém contagem total de análises
    /// </summary>
    Task<int> ContarAsync();
}


