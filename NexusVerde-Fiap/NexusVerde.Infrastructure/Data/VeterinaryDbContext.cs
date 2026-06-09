using NexusVerde.Domain.Entities;
using NexusVerde.Infrastructure.Data.Configurations;
using Microsoft.EntityFrameworkCore;

namespace NexusVerde.Infrastructure.Data;

/// <summary>
/// DbContext da Aplicação de Monitoramento Ambiental
/// 
/// Responsabilidades:
/// - Define o mapeamento entre entidades de monitoramento e tabelas do banco
/// - Carrega as configurações de cada entidade via IEntityTypeConfiguration
/// - Gerencia o acesso aos dados ambientais
/// 
/// Arquitetura Clean: Infrastructure Layer
/// Esta classe não contém lógica de negócio, apenas persistência
/// </summary>
public class VeterinaryDbContext : DbContext
{
    public VeterinaryDbContext(DbContextOptions<VeterinaryDbContext> options) : base(options)
    {
    }

    // DbSets para monitoramento ambiental
    public DbSet<RegiaoMonitorada> RegioesMonitoradas { get; set; } = null!;
    public DbSet<FonteSatelital> FontesSatelitais { get; set; } = null!;
    public DbSet<ImagemSatelital> ImagensSatelitais { get; set; } = null!;
    public DbSet<AnaliseAmbiental> AnalisesAmbientais { get; set; } = null!;
    public DbSet<AnaliseImagemAmbiental> AnalisesImagensAmbientais { get; set; } = null!;
    public DbSet<AlertaAmbiental> AlertasAmbientais { get; set; } = null!;
    public DbSet<HistoricoMonitoramento> HistoricosMonitoramento { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Environmental configurations
        modelBuilder.ApplyConfiguration(new RegiaoMonitoradaConfiguration());
        modelBuilder.ApplyConfiguration(new FonteSatelitalConfiguration());
        modelBuilder.ApplyConfiguration(new ImagemSatelitalConfiguration());
        modelBuilder.ApplyConfiguration(new AnaliseAmbientalConfiguration());
        modelBuilder.ApplyConfiguration(new AnaliseImagemAmbientalConfiguration());
        modelBuilder.ApplyConfiguration(new AlertaAmbientalConfiguration());
        modelBuilder.ApplyConfiguration(new HistoricoMonitoramentoConfiguration());
    }
}
