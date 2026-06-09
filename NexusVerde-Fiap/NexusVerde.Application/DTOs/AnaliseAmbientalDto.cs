using NexusVerde.Domain.Enums;

namespace NexusVerde.Application.DTOs;

/// <summary>
/// DTO para Análise Ambiental
/// </summary>
public class AnaliseAmbientalDto
{
    public int Id { get; set; }
    public int ImagemSatelitalId { get; set; }
    public decimal? NdviMedio { get; set; }
    public decimal? PercentualVegetacao { get; set; }
    public decimal? PercentualSoloExposto { get; set; }
    public decimal? PercentualAreaQueimada { get; set; }
    public ClassificacaoAmbiental Classificacao { get; set; }
    public NivelRisco NivelRisco { get; set; }
    public string? Resumo { get; set; }
    public DateTime DataAnalise { get; set; }
}

/// <summary>
/// DTO para criar Análise Ambiental
/// </summary>
public class CreateAnaliseAmbientalDto
{
    public int ImagemSatelitalId { get; set; }
    public decimal? NdviMedio { get; set; }
    public decimal? PercentualVegetacao { get; set; }
    public decimal? PercentualSoloExposto { get; set; }
    public decimal? PercentualAreaQueimada { get; set; }
    public string? Resumo { get; set; }
}

/// <summary>
/// DTO para simular Análise Ambiental
/// </summary>
public class SimularAnaliseDto
{
    public int RegiaoMonitoradaId { get; set; }
    public int FonteSatelitalId { get; set; }
    public DateTime DataCaptura { get; set; }
}

