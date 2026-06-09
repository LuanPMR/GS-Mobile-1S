using NexusVerde.Domain.Commons;

namespace NexusVerde.Domain.Entities;

/// <summary>
/// Entidade de Imagem Satelital
/// Representa uma aquisição de imagem satelital de uma região monitorada
/// </summary>
public class ImagemSatelital : EntityBase
{
    public int RegiaoMonitoradaId { get; set; }
    public int FonteSatelitalId { get; set; }
    public DateTime DataCaptura { get; set; }
    public string? UrlImagem { get; set; }
    public decimal? PercentualNuvem { get; set; }
    public bool Processada { get; set; } = false;
    public DateTime DataCadastro { get; set; } = DateTime.UtcNow;

    // Relacionamentos
    public RegiaoMonitorada? RegiaoMonitorada { get; set; }
    public FonteSatelital? FonteSatelital { get; set; }
    public AnaliseAmbiental? AnaliseAmbiental { get; set; }
}

