using NexusVerde.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace NexusVerde.Infrastructure.Data.Configurations;

public class HistoricoMonitoramentoConfiguration : IEntityTypeConfiguration<HistoricoMonitoramento>
{
    public void Configure(EntityTypeBuilder<HistoricoMonitoramento> builder)
    {
        builder.ToTable("TB_HISTORICOS_MONITORAMENTO");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id)
            .HasColumnName("ID_HISTORICO")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.RegiaoMonitoradaId)
            .HasColumnName("ID_REGIAO")
            .IsRequired();

        builder.Property(x => x.DataRegistro)
            .HasColumnName("DATA_REGISTRO")
            .HasColumnType("TIMESTAMP")
            .HasDefaultValueSql("SYSTIMESTAMP");

        builder.Property(x => x.NdviAnterior)
            .HasColumnName("NDVI_ANTERIOR")
            .HasColumnType("NUMBER(10,4)");

        builder.Property(x => x.NdviAtual)
            .HasColumnName("NDVI_ATUAL")
            .HasColumnType("NUMBER(10,4)");

        builder.Property(x => x.VariacaoNdvi)
            .HasColumnName("VARIACAO_NDVI")
            .HasColumnType("NUMBER(10,4)");

        builder.Property(x => x.Observacao)
            .HasColumnName("OBSERVACAO")
            .HasColumnType("VARCHAR2(1000)");

        // Índices
        builder.HasIndex(x => x.RegiaoMonitoradaId);
        builder.HasIndex(x => x.DataRegistro).IsDescending();
    }
}

