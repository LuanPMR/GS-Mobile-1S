using NexusVerde.Domain.Entities;

namespace NexusVerde.Application.Interfaces;

/// <summary>
/// Interface do repositório para AlertaAmbiental
/// Define operações de persistência de alertas ambientais
/// </summary>
public interface IAlertaAmbientalRepository
{
    Task<IEnumerable<AlertaAmbiental>> ObterTodosAsync();
    Task<AlertaAmbiental?> ObterPorIdAsync(int id);
    Task<IEnumerable<AlertaAmbiental>> ObterPorRegiaoAsync(int regiaoId);
    Task<IEnumerable<AlertaAmbiental>> ObterPorNivelRiscoAsync(string nivelRisco);
    Task<IEnumerable<AlertaAmbiental>> ObterPendentesAsync();
    Task<AlertaAmbiental> CriarAsync(AlertaAmbiental alerta);
    Task<AlertaAmbiental> AtualizarAsync(AlertaAmbiental alerta);
    Task<bool> DeletarAsync(int id);
    Task<bool> ExisteAsync(int id);
}

