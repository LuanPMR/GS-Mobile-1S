using NexusVerde.Domain.Enums;

namespace NexusVerde.Application.DTOs;

/// <summary>
/// DTO para Fonte Satelital
/// </summary>
public class FonteSatelitalDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = null!;
    public TipoFonteSatelital Tipo { get; set; }
    public string? Provedor { get; set; }
    public decimal? ResolucaoMetros { get; set; }
    public decimal? FrequenciaRevisitaHoras { get; set; }
    public bool Ativo { get; set; }
    public DateTime DataCadastro { get; set; }
}

/// <summary>
/// DTO para criar Fonte Satelital
/// </summary>
public class CreateFonteSatelitalDto
{
    public string Nome { get; set; } = null!;
    public TipoFonteSatelital Tipo { get; set; }
    public string? Provedor { get; set; }
    public decimal? ResolucaoMetros { get; set; }
    public decimal? FrequenciaRevisitaHoras { get; set; }
}

/// <summary>
/// DTO para atualizar Fonte Satelital
/// </summary>
public class UpdateFonteSatelitalDto
{
    public string? Nome { get; set; }
    public TipoFonteSatelital? Tipo { get; set; }
    public string? Provedor { get; set; }
    public decimal? ResolucaoMetros { get; set; }
    public decimal? FrequenciaRevisitaHoras { get; set; }
    public bool? Ativo { get; set; }
}

