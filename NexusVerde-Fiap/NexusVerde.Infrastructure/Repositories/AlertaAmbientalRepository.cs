using Microsoft.EntityFrameworkCore;
using NexusVerde.Application.Interfaces;
using NexusVerde.Domain.Entities;
using NexusVerde.Infrastructure.Data;

namespace NexusVerde.Infrastructure.Repositories;

/// <summary>
/// Repositório para AlertaAmbiental
/// Implementa a interface IAlertaAmbientalRepository para persistência de dados
/// </summary>
public class AlertaAmbientalRepository : IAlertaAmbientalRepository
{
    private readonly VeterinaryDbContext _context;

    public AlertaAmbientalRepository(VeterinaryDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Obtém todos os alertas ambientais do banco de dados
    /// </summary>
    public async Task<IEnumerable<AlertaAmbiental>> ObterTodosAsync()
    {
        return await _context.AlertasAmbientais
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Obtém um alerta específico por ID
    /// </summary>
    public async Task<AlertaAmbiental?> ObterPorIdAsync(int id)
    {
        return await _context.AlertasAmbientais
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    /// <summary>
    /// Obtém alertas de uma região específica
    /// </summary>
    public async Task<IEnumerable<AlertaAmbiental>> ObterPorRegiaoAsync(int regiaoId)
    {
        return await _context.AlertasAmbientais
            .AsNoTracking()
            .Where(a => a.RegiaoMonitoradaId == regiaoId)
            .ToListAsync();
    }

    /// <summary>
    /// Obtém alertas por nível de risco
    /// </summary>
    public async Task<IEnumerable<AlertaAmbiental>> ObterPorNivelRiscoAsync(string nivelRisco)
    {
        return await _context.AlertasAmbientais
            .AsNoTracking()
            .Where(a => a.NivelRisco.ToString() == nivelRisco)
            .ToListAsync();
    }

    /// <summary>
    /// Obtém alertas não resolvidos (pendentes)
    /// </summary>
    public async Task<IEnumerable<AlertaAmbiental>> ObterPendentesAsync()
    {
        return await _context.AlertasAmbientais
            .AsNoTracking()
            .Where(a => !a.Resolvido)
            .ToListAsync();
    }

    /// <summary>
    /// Cria um novo alerta no banco de dados
    /// </summary>
    public async Task<AlertaAmbiental> CriarAsync(AlertaAmbiental alerta)
    {
        alerta.DataCriacao = DateTime.UtcNow;
        _context.AlertasAmbientais.Add(alerta);
        await _context.SaveChangesAsync();
        return alerta;
    }

    /// <summary>
    /// Atualiza um alerta existente
    /// </summary>
    public async Task<AlertaAmbiental> AtualizarAsync(AlertaAmbiental alerta)
    {
        _context.AlertasAmbientais.Update(alerta);
        await _context.SaveChangesAsync();
        return alerta;
    }

    /// <summary>
    /// Deleta um alerta pelo ID
    /// </summary>
    public async Task<bool> DeletarAsync(int id)
    {
        var alerta = await _context.AlertasAmbientais.FindAsync(id);
        if (alerta == null)
            return false;

        _context.AlertasAmbientais.Remove(alerta);
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Verifica se um alerta existe pelo ID
    /// </summary>
    public async Task<bool> ExisteAsync(int id)
    {
        return await _context.AlertasAmbientais.AnyAsync(a => a.Id == id);
    }
}

