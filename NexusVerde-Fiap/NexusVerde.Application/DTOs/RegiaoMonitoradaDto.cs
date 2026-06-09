using NexusVerde.Domain.Enums;

namespace NexusVerde.Application.DTOs;

/// <summary>
/// DTO para Região Monitorada
/// </summary>
public class RegiaoMonitoradaDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = null!;
    public TipoBioma Bioma { get; set; }
    public string? Estado { get; set; }
    public string? Pais { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? AreaKm2 { get; set; }
    public DateTime DataCadastro { get; set; }
    public bool Ativa { get; set; }
}

/// <summary>
/// DTO para criar Região Monitorada
/// </summary>
public class CreateRegiaoMonitoradaDto
{
    public string Nome { get; set; } = null!;
    public TipoBioma Bioma { get; set; }
    public string? Estado { get; set; }
    public string? Pais { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? AreaKm2 { get; set; }
}

/// <summary>
/// DTO para atualizar Região Monitorada
/// </summary>
public class UpdateRegiaoMonitoradaDto
{
    public string? Nome { get; set; }
    public TipoBioma? Bioma { get; set; }
    public string? Estado { get; set; }
    public string? Pais { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? AreaKm2 { get; set; }
    public bool? Ativa { get; set; }
}

