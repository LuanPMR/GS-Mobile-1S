using System.Collections.Generic;

namespace NexusVerde.Application.DTOs;

public class ImageAnalysisResultDto
{
    public int TotalCelulas { get; set; }
    public int VegetacaoSaudavel { get; set; }
    public int VegetacaoModerada { get; set; }
    public int SoloExposto { get; set; }
    public int PossivelQueimada { get; set; }
    public int AreaIndefinida { get; set; }
    public string NivelRisco { get; set; } = string.Empty;
    public string Resumo { get; set; } = string.Empty;
    public List<CellAnalysisDto> Celulas { get; set; } = new();
}

