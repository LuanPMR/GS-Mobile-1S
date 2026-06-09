namespace NexusVerde.Application.DTOs;

/// <summary>
/// DTO para Histórico de Monitoramento
/// </summary>
public class HistoricoMonitoramentoDto
{
    public int Id { get; set; }
    public int RegiaoMonitoradaId { get; set; }
    public DateTime DataRegistro { get; set; }
    public decimal? NdviAnterior { get; set; }
    public decimal? NdviAtual { get; set; }
    public decimal? VariacaoNdvi { get; set; }
    public string? Observacao { get; set; }
}

/// <summary>
/// DTO para criar Histórico de Monitoramento
/// </summary>
public class CreateHistoricoMonitoramentoDto
{
    public int RegiaoMonitoradaId { get; set; }
    public decimal? NdviAnterior { get; set; }
    public decimal? NdviAtual { get; set; }
    public string? Observacao { get; set; }
}

