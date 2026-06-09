using NexusVerde.Domain.Commons;
using NexusVerde.Domain.Enums;

namespace NexusVerde.Domain.Entities;

/// <summary>
/// Entidade de Região Monitorada
/// Representa uma área geográfica sob monitoramento ambiental contínuo
/// </summary>
public class RegiaoMonitorada : EntityBase
{
    public string Nome { get; set; } = null!;
    public TipoBioma Bioma { get; set; }
    public string? Estado { get; set; }
    public string? Pais { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? AreaKm2 { get; set; }
    public DateTime DataCadastro { get; set; } = DateTime.UtcNow;
    public bool Ativa { get; set; } = true;

    // Relacionamentos um-para-muitos
    public ICollection<ImagemSatelital> ImagensSatelitais { get; set; } = new List<ImagemSatelital>();
    public ICollection<AlertaAmbiental> AlertasAmbientais { get; set; } = new List<AlertaAmbiental>();
    public ICollection<HistoricoMonitoramento> Historicos { get; set; } = new List<HistoricoMonitoramento>();
    public ICollection<AnaliseImagemAmbiental> AnalisesImagensambiental { get; set; } = new List<AnaliseImagemAmbiental>();
}

