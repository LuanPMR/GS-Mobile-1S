using NexusVerde.Application.DTOs;
using NexusVerde.Domain.Entities;

namespace NexusVerde.Application.Interfaces;

/// <summary>
/// Interface para serviço de Alertas Ambientais
/// </summary>
public interface IAlertaAmbientalService
{
    Task<IEnumerable<AlertaAmbientalDto>> ObterTodas();
    Task<AlertaAmbientalDto?> ObterPorId(int id);
    Task<IEnumerable<AlertaAmbientalDto>> ObterPorRegiao(int regiaoId);
    Task<IEnumerable<AlertaAmbientalDto>> ObterPorNivelRisco(string nivelRisco);
    Task<IEnumerable<AlertaAmbientalDto>> ObterPendentes();
    Task<AlertaAmbientalDto> Criar(CreateAlertaAmbientalDto dto);
    Task<AlertaAmbientalDto?> Atualizar(int id, UpdateAlertaAmbientalDto dto);
    Task<bool> Deletar(int id);
    Task<AlertaAmbientalDto?> ResolverAsync(int id);
    Task<AlertaAmbientalDto?> GerarAlertaPorAnaliseAsync(AnaliseImagemAmbiental analise, int? regiaoMonitoradaId = null);
}

