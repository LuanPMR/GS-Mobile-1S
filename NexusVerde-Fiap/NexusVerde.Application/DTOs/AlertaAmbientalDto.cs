using NexusVerde.Domain.Enums;

namespace NexusVerde.Application.DTOs;

/// <summary>
/// DTO para Alerta Ambiental
/// </summary>
public class AlertaAmbientalDto
{
    public int Id { get; set; }
    public int RegiaoMonitoradaId { get; set; }
    public int? AnaliseAmbientalId { get; set; }
    public TipoAlertaAmbiental TipoAlerta { get; set; }
    public NivelRisco NivelRisco { get; set; }
    public string? Mensagem { get; set; }
    public bool Resolvido { get; set; }
    public DateTime DataCriacao { get; set; }
    public DateTime? DataResolucao { get; set; }
}

/// <summary>
/// DTO para criar Alerta Ambiental
/// </summary>
public class CreateAlertaAmbientalDto
{
    public int RegiaoMonitoradaId { get; set; }
    public int? AnaliseAmbientalId { get; set; }
    public TipoAlertaAmbiental TipoAlerta { get; set; }
    public NivelRisco NivelRisco { get; set; }
    public string? Mensagem { get; set; }
}

/// <summary>
/// DTO para atualizar Alerta Ambiental
/// </summary>
public class UpdateAlertaAmbientalDto
{
    public TipoAlertaAmbiental? TipoAlerta { get; set; }
    public NivelRisco? NivelRisco { get; set; }
    public string? Mensagem { get; set; }
    public bool? Resolvido { get; set; }
}

