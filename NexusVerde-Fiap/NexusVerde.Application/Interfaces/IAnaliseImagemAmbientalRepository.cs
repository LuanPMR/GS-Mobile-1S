using NexusVerde.Domain.Entities;

namespace NexusVerde.Application.Interfaces;

/// <summary>
/// Interface do repositório para AnaliseImagemAmbiental
/// Define as operações de acesso a dados para análises de imagens
/// </summary>
public interface IAnaliseImagemAmbientalRepository
{
    /// <summary>
    /// Adiciona uma nova análise ao repositório
    /// </summary>
    Task<AnaliseImagemAmbiental> AddAsync(AnaliseImagemAmbiental analise);

    /// <summary>
    /// Obtém todas as análises
    /// </summary>
    Task<IEnumerable<AnaliseImagemAmbiental>> GetAllAsync();

    /// <summary>
    /// Obtém uma análise por ID
    /// </summary>
    Task<AnaliseImagemAmbiental?> GetByIdAsync(int id);

    /// <summary>
    /// Obtém análises de uma região monitorada específica
    /// </summary>
    Task<IEnumerable<AnaliseImagemAmbiental>> GetByRegiaoAsync(int regiaoId);

    /// <summary>
    /// Obtém análises por nível de risco
    /// </summary>
    Task<IEnumerable<AnaliseImagemAmbiental>> GetByRiscoAsync(string nivelRisco);

    /// <summary>
    /// Obtém análises dentro de um intervalo de datas
    /// </summary>
    Task<IEnumerable<AnaliseImagemAmbiental>> GetByDateRangeAsync(DateTime dataInicio, DateTime dataFim);

    /// <summary>
    /// Deleta uma análise por ID
    /// </summary>
    Task<bool> DeleteAsync(int id);

    /// <summary>
    /// Obtém o total de análises
    /// </summary>
    Task<int> CountAsync();
}

