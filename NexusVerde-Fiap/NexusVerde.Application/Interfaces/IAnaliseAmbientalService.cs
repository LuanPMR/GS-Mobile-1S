using NexusVerde.Application.DTOs;

namespace NexusVerde.Application.Interfaces;

/// <summary>
/// Interface para serviço de Análises Ambientais
/// </summary>
public interface IAnaliseAmbientalService
{
    Task<IEnumerable<AnaliseAmbientalDto>> ObterTodas();
    Task<AnaliseAmbientalDto?> ObterPorId(int id);
    Task<IEnumerable<AnaliseAmbientalDto>> ObterPorRegiao(int regiaoId);
    Task<AnaliseAmbientalDto> Criar(CreateAnaliseAmbientalDto dto);
    Task<AnaliseAmbientalDto> SimularAnalise(SimularAnaliseDto dto);
    Task<bool> Deletar(int id);
}

