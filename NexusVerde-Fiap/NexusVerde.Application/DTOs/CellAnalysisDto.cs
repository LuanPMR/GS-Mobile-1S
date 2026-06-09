namespace NexusVerde.Application.DTOs;

public class CellAnalysisDto
{
    public int Linha { get; set; }
    public int Coluna { get; set; }
    public string CorMedia { get; set; } = "#000000";
    public string Classificacao { get; set; } = string.Empty;
}

