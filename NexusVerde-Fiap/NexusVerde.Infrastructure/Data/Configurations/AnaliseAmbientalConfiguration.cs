using NexusVerde.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace NexusVerde.Infrastructure.Data.Configurations;

public class AnaliseAmbientalConfiguration : IEntityTypeConfiguration<AnaliseAmbiental>
{
    public void Configure(EntityTypeBuilder<AnaliseAmbiental> builder)
    {
        builder.ToTable("TB_ANALISES_AMBIENTAIS");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id)
            .HasColumnName("ID_ANALISE")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.ImagemSatelitalId)
            .HasColumnName("ID_IMAGEM")
            .IsRequired();

        builder.Property(x => x.NdviMedio)
            .HasColumnName("NDVI_MEDIO")
            .HasColumnType("NUMBER(10,4)");

        builder.Property(x => x.PercentualVegetacao)
            .HasColumnName("PERCENTUAL_VEGETACAO")
            .HasColumnType("NUMBER(5,2)");

        builder.Property(x => x.PercentualSoloExposto)
            .HasColumnName("PERCENTUAL_SOLO_EXPOSTO")
            .HasColumnType("NUMBER(5,2)");

        builder.Property(x => x.PercentualAreaQueimada)
            .HasColumnName("PERCENTUAL_AREA_QUEIMADA")
            .HasColumnType("NUMBER(5,2)");

        builder.Property(x => x.Classificacao)
            .HasColumnName("CLASSIFICACAO")
            .HasColumnType("NUMBER")
            .IsRequired();

        builder.Property(x => x.NivelRisco)
            .HasColumnName("NIVEL_RISCO")
            .HasColumnType("NUMBER")
            .IsRequired();

        builder.Property(x => x.Resumo)
            .HasColumnName("RESUMO")
            .HasColumnType("VARCHAR2(1000)");

        builder.Property(x => x.DataAnalise)
            .HasColumnName("DATA_ANALISE")
            .HasColumnType("TIMESTAMP")
            .HasDefaultValueSql("SYSTIMESTAMP");

        // Índices
        builder.HasIndex(x => x.ImagemSatelitalId);
    }
}

