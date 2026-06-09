using NexusVerde.Domain.Commons;

namespace NexusVerde.Domain.Entities;

/// <summary>
/// Entidade de Histórico de Monitoramento
/// Registra o histórico de mudanças ambientais de uma região
/// </summary>
public class HistoricoMonitoramento : EntityBase
{
    public int RegiaoMonitoradaId { get; set; }
    public DateTime DataRegistro { get; set; } = DateTime.UtcNow;
    public decimal? NdviAnterior { get; set; }
    public decimal? NdviAtual { get; set; }
    public decimal? VariacaoNdvi { get; set; }
    public string? Observacao { get; set; }

    // Relacionamentos
    public RegiaoMonitorada? RegiaoMonitorada { get; set; }
}

