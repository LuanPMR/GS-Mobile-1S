using System.Collections.Generic;

namespace NexusVerde.Application.DTOs;

public class ResultadoAnaliseImagemDto
{
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
    public List<CelulaAnalisadaDto> Celulas { get; set; } = new();

    // Campos para alerta automático
    public bool AlertaGerado { get; set; } = false;
    public int? AlertaId { get; set; }
    public string? MensagemAlerta { get; set; }
}

