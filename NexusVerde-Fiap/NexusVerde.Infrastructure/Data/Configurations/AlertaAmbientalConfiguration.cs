using NexusVerde.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace NexusVerde.Infrastructure.Data.Configurations;

public class AlertaAmbientalConfiguration : IEntityTypeConfiguration<AlertaAmbiental>
{
    public void Configure(EntityTypeBuilder<AlertaAmbiental> builder)
    {
        builder.ToTable("TB_ALERTAS_AMBIENTAIS");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id)
            .HasColumnName("ID_ALERTA")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.RegiaoMonitoradaId)
            .HasColumnName("ID_REGIAO")
            .IsRequired();

        builder.Property(x => x.AnaliseAmbientalId)
            .HasColumnName("ID_ANALISE");

        builder.Property(x => x.TipoAlerta)
            .HasColumnName("TIPO_ALERTA")
            .HasColumnType("NUMBER")
            .IsRequired();

        builder.Property(x => x.NivelRisco)
            .HasColumnName("NIVEL_RISCO")
            .HasColumnType("NUMBER")
            .IsRequired();

        builder.Property(x => x.Mensagem)
            .HasColumnName("MENSAGEM")
            .HasColumnType("VARCHAR2(1000)");

        builder.Property(x => x.Resolvido)
            .HasColumnName("RESOLVIDO")
            .HasColumnType("NUMBER(1)")
            .HasDefaultValue(0);

        builder.Property(x => x.DataCriacao)
            .HasColumnName("DATA_CRIACAO")
            .HasColumnType("TIMESTAMP")
            .HasDefaultValueSql("SYSTIMESTAMP");

        builder.Property(x => x.DataResolucao)
            .HasColumnName("DATA_RESOLUCAO")
            .HasColumnType("TIMESTAMP");

        // Índices
        builder.HasIndex(x => x.RegiaoMonitoradaId);
        builder.HasIndex(x => x.NivelRisco);
        builder.HasIndex(x => x.Resolvido);
    }
}

