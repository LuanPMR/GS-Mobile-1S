using NexusVerde.Domain.Commons;
using NexusVerde.Domain.Enums;

namespace NexusVerde.Domain.Entities;

/// <summary>
/// Entidade de Alerta Ambiental
/// Representa um alerta gerado pela análise de riscos ambientais
/// </summary>
public class AlertaAmbiental : EntityBase
{
    public int RegiaoMonitoradaId { get; set; }
    public int? AnaliseAmbientalId { get; set; }
    public int? AnaliseImagemAmbientalId { get; set; }
    public TipoAlertaAmbiental TipoAlerta { get; set; }
    public NivelRisco NivelRisco { get; set; }
    public string? Mensagem { get; set; }
    public bool Resolvido { get; set; } = false;
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    public DateTime? DataResolucao { get; set; }

    // Relacionamentos
    public RegiaoMonitorada? RegiaoMonitorada { get; set; }
    public AnaliseAmbiental? AnaliseAmbiental { get; set; }
    public AnaliseImagemAmbiental? AnaliseImagemAmbiental { get; set; }
}



