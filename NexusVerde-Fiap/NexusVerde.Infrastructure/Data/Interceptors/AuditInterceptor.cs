using NexusVerde.Domain.Commons;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace NexusVerde.Infrastructure.Data.Interceptors;

/// <summary>
/// Interceptor para auditoria automática
/// Atualiza campos UpdatedAt, CreatedBy e UpdatedBy automaticamente
/// 
/// Uso: Registrar no Dependency Injection como AddInterceptors(new AuditInterceptor())
/// </summary>
public class AuditInterceptor : SaveChangesInterceptor
{
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        var dbContext = eventData.Context;

        if (dbContext is null)
            return base.SavingChangesAsync(eventData, result, cancellationToken);

        var entries = dbContext.ChangeTracker
            .Entries()
            .Where(e => e.Entity is EntityBase);

        foreach (var entry in entries)
        {
            var entity = (EntityBase)entry.Entity;

            if (entry.State == EntityState.Modified)
            {
                entity.UpdatedAt = DateTime.UtcNow;
            }

            if (entry.State == EntityState.Added)
            {
                entity.CreatedAt = DateTime.UtcNow;
            }
        }

        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }
}
