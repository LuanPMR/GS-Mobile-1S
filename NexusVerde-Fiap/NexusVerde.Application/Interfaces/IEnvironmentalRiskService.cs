using NexusVerde.Application.DTOs;

namespace NexusVerde.Application.Interfaces;

/// <summary>
/// Interface para análise ambiental baseada em regras
/// </summary>
public interface IEnvironmentalRiskService
{
    /// <summary>
    /// Analisa os dados de uma imagem satelital e retorna classificação ambiental
    /// </summary>
    Task<AnaliseAmbientalDto> AnaliserPorRegras(ImagemSatelitalDto imagem);
    
    /// <summary>
    /// Verifica se há alertas necessários baseado na análise
    /// </summary>
    Task<IEnumerable<AlertaAmbientalDto>> VerificarAlertas(AnaliseAmbientalDto analise, int regiaoMonitoradaId);
}

