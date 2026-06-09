using NexusVerde.Domain.Commons;
using NexusVerde.Domain.Enums;

namespace NexusVerde.Domain.Entities;

/// <summary>
/// Entidade de Fonte Satelital
/// Representa um satélite ou fonte de dados de observação terrestre
/// </summary>
public class FonteSatelital : EntityBase
{
    public string Nome { get; set; } = null!;
    public TipoFonteSatelital Tipo { get; set; }
    public string? Provedor { get; set; }
    public decimal? ResolucaoMetros { get; set; }
    public decimal? FrequenciaRevisitaHoras { get; set; }
    public bool Ativo { get; set; } = true;
    public DateTime DataCadastro { get; set; } = DateTime.UtcNow;

    // Relacionamentos um-para-muitos
    public ICollection<ImagemSatelital> ImagensSatelitais { get; set; } = new List<ImagemSatelital>();
}

