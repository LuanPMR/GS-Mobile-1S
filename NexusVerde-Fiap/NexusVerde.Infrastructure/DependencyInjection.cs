using System;
using NexusVerde.Application.Interfaces;
using NexusVerde.Infrastructure.Data;
using NexusVerde.Infrastructure.Data.Interceptors;
using NexusVerde.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace NexusVerde.Infrastructure;

/// <summary>
/// Dependency Injection para a camada Infrastructure
/// Centraliza toda a configuração de persistência (banco de dados e repositórios)
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Registra os serviços de Infrastructure (DbContext e Repositórios)
    /// </summary>
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration? configuration = null)
    {
        services.AddSingleton<AuditInterceptor>();

        // Registrar repositórios
        services.AddScoped<IAlertaAmbientalRepository, AlertaAmbientalRepository>();
        services.AddScoped<IAnaliseImagemAmbientalRepository, AnaliseImagemAmbientalRepository>();

        if (configuration != null)
        {
            ConfigureDatabase(services, configuration);
        }

        return services;
    }

    /// <summary>
    /// Configura o DbContext com Oracle ou InMemoryDatabase
    /// Toda a lógica de persistência fica centralizada aqui
    /// </summary>
    private static void ConfigureDatabase(IServiceCollection services, IConfiguration configuration)
    {
        // Exigir explicitamente a connection string Oracle para evitar fallback silencioso
        // A chave esperada é exatamente: "NexusVerdeOracle"
        var connectionString = configuration.GetConnectionString("NexusVerdeOracle");

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            // Ambiente de desenvolvimento sem Oracle configurado: usa InMemory database para permitir execução local e testes.
            services.AddDbContext<VeterinaryDbContext>((sp, options) =>
            {
                options.UseInMemoryDatabase("NexusVerde_InMemory");
            });
            return;
        }

        services.AddDbContext<VeterinaryDbContext>((sp, options) =>
        {
            // Usa Oracle quando a connection string 'NexusVerdeOracle' estiver presente
            options.UseOracle(connectionString);

            // Adicionar Interceptor apenas com DB real
            if (sp.GetService<AuditInterceptor>() is not null)
            {
                options.AddInterceptors(sp.GetRequiredService<AuditInterceptor>());
            }
        });
    }
}



