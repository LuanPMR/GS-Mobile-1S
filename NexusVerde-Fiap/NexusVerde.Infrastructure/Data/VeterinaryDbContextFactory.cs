using System;
using System.IO;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace NexusVerde.Infrastructure.Data;

/// <summary>
/// Factory para criar DbContext em design time (migrations)
/// Configura o DbContext para usar Oracle com a connection string definida no
/// appsettings.json do projeto principal 'NexusVerde WebAPI'.
/// </summary>
public class VeterinaryDbContextFactory : IDesignTimeDbContextFactory<VeterinaryDbContext>
{
    public VeterinaryDbContext CreateDbContext(string[] args)
    {
        // Construir caminho para o appsettings.json do projeto principal
        var basePath = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../../NexusVerde WebAPI"));
        var settingsPath = Path.Combine(basePath, "appsettings.json");

        if (!File.Exists(settingsPath))
        {
            throw new InvalidOperationException($"Arquivo de configuração não encontrado: {settingsPath}");
        }

        var json = File.ReadAllText(settingsPath);

        using var doc = JsonDocument.Parse(json);
        string? connectionString = null;

        if (doc.RootElement.TryGetProperty("ConnectionStrings", out var connSection) &&
            connSection.ValueKind == JsonValueKind.Object &&
            connSection.TryGetProperty("NexusVerdeOracle", out var csElement) &&
            csElement.ValueKind == JsonValueKind.String)
        {
            connectionString = csElement.GetString();
        }

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                "Connection string 'NexusVerdeOracle' não encontrada no appsettings.json da WebAPI principal."
            );
        }

        var optionsBuilder = new DbContextOptionsBuilder<VeterinaryDbContext>();
        // Chamar UseOracle através do cast para a versão não genérica para evitar ambiguidade de overloads
        ((DbContextOptionsBuilder)optionsBuilder).UseOracle(connectionString);

        return new VeterinaryDbContext(optionsBuilder.Options);
    }
}

