namespace NexusVerde.Application.DTOs;

/// <summary>
/// DTO para resposta de análise de imagem ambiental
/// Retorna o resultado da análise salvo no banco
/// </summary>
public class AnaliseImagemAmbientalResponseDto
{
    public int Id { get; set; }
    public string NomeArquivo { get; set; } = string.Empty;
    public DateTime DataAnalise { get; set; }
    public int TotalCelulas { get; set; }
    public int VegetacaoSaudavel { get; set; }
    public int VegetacaoModerada { get; set; }
    public int SoloExposto { get; set; }
    public int PossivelQueimada { get; set; }
    public int AreaIndefinida { get; set; }
    public double PercentualVegetacaoSaudavel { get; set; }
    public double PercentualVegetacaoModerada { get; set; }
    public double PercentualSoloExposto { get; set; }
    public double PercentualPossivelQueimada { get; set; }
    public double PercentualAreaIndefinida { get; set; }
    public string NivelRisco { get; set; } = string.Empty;
    public string Resumo { get; set; } = string.Empty;
    public int? RegiaoMonitoradaId { get; set; }
}

