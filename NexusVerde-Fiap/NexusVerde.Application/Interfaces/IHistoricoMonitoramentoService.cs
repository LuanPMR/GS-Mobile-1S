using NexusVerde.Application.DTOs;

namespace NexusVerde.Application.Interfaces;

/// <summary>
/// Interface para serviço de Histórico de Monitoramento
/// </summary>
public interface IHistoricoMonitoramentoService
{
    Task<IEnumerable<HistoricoMonitoramentoDto>> ObterPorRegiao(int regiaoId);
    Task<HistoricoMonitoramentoDto> Criar(CreateHistoricoMonitoramentoDto dto);
    Task<bool> Deletar(int id);
}

