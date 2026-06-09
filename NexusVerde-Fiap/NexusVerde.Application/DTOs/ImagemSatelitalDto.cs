namespace NexusVerde.Application.DTOs;

/// <summary>
/// DTO para Imagem Satelital
/// </summary>
public class ImagemSatelitalDto
{
    public int Id { get; set; }
    public int RegiaoMonitoradaId { get; set; }
    public int FonteSatelitalId { get; set; }
    public DateTime DataCaptura { get; set; }
    public string? UrlImagem { get; set; }
    public decimal? PercentualNuvem { get; set; }
    public bool Processada { get; set; }
    public DateTime DataCadastro { get; set; }
}

/// <summary>
/// DTO para criar Imagem Satelital
/// </summary>
public class CreateImagemSatelitalDto
{
    public int RegiaoMonitoradaId { get; set; }
    public int FonteSatelitalId { get; set; }
    public DateTime DataCaptura { get; set; }
    public string? UrlImagem { get; set; }
    public decimal? PercentualNuvem { get; set; }
}

/// <summary>
/// DTO para atualizar Imagem Satelital
/// </summary>
public class UpdateImagemSatelitalDto
{
    public DateTime? DataCaptura { get; set; }
    public string? UrlImagem { get; set; }
    public decimal? PercentualNuvem { get; set; }
    public bool? Processada { get; set; }
}

