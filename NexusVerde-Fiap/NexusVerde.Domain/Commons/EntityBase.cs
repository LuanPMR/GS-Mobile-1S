namespace NexusVerde.Domain.Commons;

/// <summary>
/// Classe base para todas as entidades do domínio
/// Fornece propriedades comuns de auditoria e rastreamento
/// </summary>
public class EntityBase
{
    public int Id { get; set; }
    
    // Auditoria
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public string? UpdatedBy { get; set; }
}
