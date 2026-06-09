using NexusVerde.Domain.Commons;
using NexusVerde.Domain.Enums;

namespace NexusVerde.Domain.Entities;

/// <summary>
/// Entidade de Análise Ambiental
/// Representa o resultado da análise de uma imagem satelital
/// </summary>
public class AnaliseAmbiental : EntityBase
{
    public int ImagemSatelitalId { get; set; }
    public decimal? NdviMedio { get; set; }
    public decimal? PercentualVegetacao { get; set; }
    public decimal? PercentualSoloExposto { get; set; }
    public decimal? PercentualAreaQueimada { get; set; }
    public ClassificacaoAmbiental Classificacao { get; set; }
    public NivelRisco NivelRisco { get; set; }
    public string? Resumo { get; set; }
    public DateTime DataAnalise { get; set; } = DateTime.UtcNow;

    // Relacionamentos
    public ImagemSatelital? ImagemSatelital { get; set; }
}

