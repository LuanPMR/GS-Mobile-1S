using NexusVerde.Domain.Commons;

namespace NexusVerde.Domain.Entities;

/// <summary>
/// Entidade de Análise de Imagem Ambiental
/// Representa o resultado da análise local de uma imagem (cores predominantes)
/// Persiste o resumo da análise para histórico e consultas
/// </summary>
public class AnaliseImagemAmbiental : EntityBase
{
    /// <summary>
    /// Nome/caminho do arquivo da imagem analisada
    /// </summary>
    public string NomeArquivo { get; set; } = null!;

    /// <summary>
    /// Data e hora da análise
    /// </summary>
    public DateTime DataAnalise { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Total de células da grade (ex: 100 para 10x10)
    /// </summary>
    public int TotalCelulas { get; set; }

    /// <summary>
    /// Quantidade de células classificadas como Vegetação Saudável
    /// </summary>
    public int VegetacaoSaudavel { get; set; }

    /// <summary>
    /// Quantidade de células classificadas como Vegetação Moderada
    /// </summary>
    public int VegetacaoModerada { get; set; }

    /// <summary>
    /// Quantidade de células classificadas como Solo Exposto
    /// </summary>
    public int SoloExposto { get; set; }

    /// <summary>
    /// Quantidade de células classificadas como Possível Queimada
    /// </summary>
    public int PossivelQueimada { get; set; }

    /// <summary>
    /// Quantidade de células classificadas como Nuvem/Área Indefinida
    /// </summary>
    public int AreaIndefinida { get; set; }

    /// <summary>
    /// Percentual de Vegetação Saudável (0-100)
    /// </summary>
    public double PercentualVegetacaoSaudavel { get; set; }

    /// <summary>
    /// Percentual de Vegetação Moderada (0-100)
    /// </summary>
    public double PercentualVegetacaoModerada { get; set; }

    /// <summary>
    /// Percentual de Solo Exposto (0-100)
    /// </summary>
    public double PercentualSoloExposto { get; set; }

    /// <summary>
    /// Percentual de Possível Queimada (0-100)
    /// </summary>
    public double PercentualPossivelQueimada { get; set; }

    /// <summary>
    /// Percentual de Nuvem/Área Indefinida (0-100)
    /// </summary>
    public double PercentualAreaIndefinida { get; set; }

    /// <summary>
    /// Nível de risco detectado na análise (Baixo, Médio, Alto, Crítico)
    /// </summary>
    public string NivelRisco { get; set; } = "Baixo";

    /// <summary>
    /// Resumo textual da análise
    /// </summary>
    public string Resumo { get; set; } = string.Empty;

    /// <summary>
    /// ID da região monitorada associada (opcional)
    /// </summary>
    public int? RegiaoMonitoradaId { get; set; }

    // Relacionamentos
    /// <summary>
    /// Região monitorada associada a esta análise (opcional)
    /// </summary>
    public RegiaoMonitorada? RegiaoMonitorada { get; set; }
}

