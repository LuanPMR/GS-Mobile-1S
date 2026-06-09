using NexusVerde.Application.DTOs;

namespace NexusVerde.Application.Interfaces;

/// <summary>
/// Interface para serviço de Regiões Monitoradas
/// </summary>
public interface IRegiaoMonitoradaService
{
    Task<IEnumerable<RegiaoMonitoradaDto>> ObterTodas();
    Task<RegiaoMonitoradaDto?> ObterPorId(int id);
    Task<IEnumerable<RegiaoMonitoradaDto>> ObterPorBioma(string bioma);
    Task<IEnumerable<RegiaoMonitoradaDto>> ObterPorEstado(string estado);
    Task<RegiaoMonitoradaDto> Criar(CreateRegiaoMonitoradaDto dto);
    Task<RegiaoMonitoradaDto?> Atualizar(int id, UpdateRegiaoMonitoradaDto dto);
    Task<bool> Deletar(int id);
}

