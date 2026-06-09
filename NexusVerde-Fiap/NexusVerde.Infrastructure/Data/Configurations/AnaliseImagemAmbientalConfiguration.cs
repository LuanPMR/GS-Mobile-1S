using NexusVerde.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace NexusVerde.Infrastructure.Data.Configurations;

/// <summary>
/// Configuração do Entity Framework para a entidade AnaliseImagemAmbiental
/// Define o mapeamento para a tabela TB_ANALISES_IMAGEM_AMBIENTAL
/// </summary>
public class AnaliseImagemAmbientalConfiguration : IEntityTypeConfiguration<AnaliseImagemAmbiental>
{
    public void Configure(EntityTypeBuilder<AnaliseImagemAmbiental> builder)
    {
        builder.ToTable("TB_ANALISES_IMAGEM_AMBIENTAL");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id)
            .HasColumnName("ID_ANALISE_IMAGEM")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.NomeArquivo)
            .HasColumnName("NOME_ARQUIVO")
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(x => x.DataAnalise)
            .HasColumnName("DATA_ANALISE")
            .HasDefaultValue(DateTime.UtcNow);

        builder.Property(x => x.TotalCelulas)
            .HasColumnName("TOTAL_CELULAS")
            .IsRequired();

        builder.Property(x => x.VegetacaoSaudavel)
            .HasColumnName("VEGETACAO_SAUDAVEL")
            .IsRequired();

        builder.Property(x => x.VegetacaoModerada)
            .HasColumnName("VEGETACAO_MODERADA")
            .IsRequired();

        builder.Property(x => x.SoloExposto)
            .HasColumnName("SOLO_EXPOSTO")
            .IsRequired();

        builder.Property(x => x.PossivelQueimada)
            .HasColumnName("POSSIVEL_QUEIMADA")
            .IsRequired();

        builder.Property(x => x.AreaIndefinida)
            .HasColumnName("AREA_INDEFINIDA")
            .IsRequired();

        builder.Property(x => x.PercentualVegetacaoSaudavel)
            .HasColumnName("PERCENTUAL_VEGETACAO_SAUDAVEL")
            .HasColumnType("BINARY_DOUBLE")
            .IsRequired();

        builder.Property(x => x.PercentualVegetacaoModerada)
            .HasColumnName("PERCENTUAL_VEGETACAO_MODERADA")
            .HasColumnType("BINARY_DOUBLE")
            .IsRequired();

        builder.Property(x => x.PercentualSoloExposto)
            .HasColumnName("PERCENTUAL_SOLO_EXPOSTO")
            .HasColumnType("BINARY_DOUBLE")
            .IsRequired();

        builder.Property(x => x.PercentualPossivelQueimada)
            .HasColumnName("PERCENTUAL_POSSIVEL_QUEIMADA")
            .HasColumnType("BINARY_DOUBLE")
            .IsRequired();

        builder.Property(x => x.PercentualAreaIndefinida)
            .HasColumnName("PERCENTUAL_AREA_INDEFINIDA")
            .HasColumnType("BINARY_DOUBLE")
            .IsRequired();

        builder.Property(x => x.NivelRisco)
            .HasColumnName("NIVEL_RISCO")
            .HasMaxLength(50)
            .IsRequired()
            .HasDefaultValue("Baixo");

        builder.Property(x => x.Resumo)
            .HasColumnName("RESUMO")
            .HasMaxLength(1000);

        builder.Property(x => x.RegiaoMonitoradaId)
            .HasColumnName("ID_REGIAO_MONITORADA");

        // Auditoria
        builder.Property(x => x.CreatedAt)
            .HasColumnName("DATA_CRIACAO")
            .HasDefaultValue(DateTime.UtcNow);

        builder.Property(x => x.UpdatedAt)
            .HasColumnName("DATA_ATUALIZACAO");

        builder.Property(x => x.CreatedBy)
            .HasColumnName("CRIADO_POR")
            .HasMaxLength(255);

        builder.Property(x => x.UpdatedBy)
            .HasColumnName("ATUALIZADO_POR")
            .HasMaxLength(255);

        // Relacionamento: uma RegiaoMonitorada pode ter várias AnaliseImagemAmbiental
        builder.HasOne(x => x.RegiaoMonitorada)
            .WithMany(r => r.AnalisesImagensambiental)
            .HasForeignKey(x => x.RegiaoMonitoradaId)
            .OnDelete(DeleteBehavior.SetNull)
            .IsRequired(false);
    }
}

