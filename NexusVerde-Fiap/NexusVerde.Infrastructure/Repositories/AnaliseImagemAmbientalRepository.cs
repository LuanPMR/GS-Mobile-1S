using NexusVerde.Domain.Entities;
using NexusVerde.Infrastructure.Data;
using NexusVerde.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace NexusVerde.Infrastructure.Repositories;

/// <summary>
/// Implementação do repositório para AnaliseImagemAmbiental
/// Fornece operações de acesso a dados para análises de imagens ambientais
/// </summary>
public class AnaliseImagemAmbientalRepository : IAnaliseImagemAmbientalRepository
{
    private readonly VeterinaryDbContext _context;

    public AnaliseImagemAmbientalRepository(VeterinaryDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Adiciona uma nova análise ao banco de dados
    /// </summary>
    public async Task<AnaliseImagemAmbiental> AddAsync(AnaliseImagemAmbiental analise)
    {
        await _context.AnalisesImagensAmbientais.AddAsync(analise);
        await _context.SaveChangesAsync();
        return analise;
    }

    /// <summary>
    /// Obtém todas as análises ordenadas por data (mais recentes primeiro)
    /// </summary>
    public async Task<IEnumerable<AnaliseImagemAmbiental>> GetAllAsync()
    {
        return await _context.AnalisesImagensAmbientais
            .AsNoTracking()
            .OrderByDescending(x => x.DataAnalise)
            .ToListAsync();
    }

    /// <summary>
    /// Obtém uma análise específica por ID
    /// </summary>
    public async Task<AnaliseImagemAmbiental?> GetByIdAsync(int id)
    {
        return await _context.AnalisesImagensAmbientais
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    /// <summary>
    /// Obtém todas as análises de uma região específica
    /// </summary>
    public async Task<IEnumerable<AnaliseImagemAmbiental>> GetByRegiaoAsync(int regiaoId)
    {
        return await _context.AnalisesImagensAmbientais
            .AsNoTracking()
            .Where(x => x.RegiaoMonitoradaId == regiaoId)
            .OrderByDescending(x => x.DataAnalise)
            .ToListAsync();
    }

    /// <summary>
    /// Obtém análises por nível de risco
    /// </summary>
    public async Task<IEnumerable<AnaliseImagemAmbiental>> GetByRiscoAsync(string nivelRisco)
    {
        return await _context.AnalisesImagensAmbientais
            .AsNoTracking()
            .Where(x => x.NivelRisco == nivelRisco)
            .OrderByDescending(x => x.DataAnalise)
            .ToListAsync();
    }

    /// <summary>
    /// Obtém análises dentro de um intervalo de datas
    /// </summary>
    public async Task<IEnumerable<AnaliseImagemAmbiental>> GetByDateRangeAsync(DateTime dataInicio, DateTime dataFim)
    {
        return await _context.AnalisesImagensAmbientais
            .AsNoTracking()
            .Where(x => x.DataAnalise >= dataInicio && x.DataAnalise <= dataFim)
            .OrderByDescending(x => x.DataAnalise)
            .ToListAsync();
    }

    /// <summary>
    /// Deleta uma análise por ID
    /// </summary>
    public async Task<bool> DeleteAsync(int id)
    {
        var analise = await _context.AnalisesImagensAmbientais.FindAsync(id);
        if (analise == null) return false;

        _context.AnalisesImagensAmbientais.Remove(analise);
        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Obtém a quantidade total de análises
    /// </summary>
    public async Task<int> CountAsync()
    {
        return await _context.AnalisesImagensAmbientais.CountAsync();
    }
}


