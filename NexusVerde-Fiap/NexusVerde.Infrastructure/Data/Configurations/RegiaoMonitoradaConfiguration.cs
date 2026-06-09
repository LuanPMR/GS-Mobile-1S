using NexusVerde.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace NexusVerde.Infrastructure.Data.Configurations;

public class RegiaoMonitoradaConfiguration : IEntityTypeConfiguration<RegiaoMonitorada>
{
    public void Configure(EntityTypeBuilder<RegiaoMonitorada> builder)
    {
        builder.ToTable("TB_REGIOES_MONITORADAS");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id)
            .HasColumnName("ID_REGIAO")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.Nome)
            .HasColumnName("NOME")
            .HasColumnType("VARCHAR2(255)")
            .IsRequired();

        builder.Property(x => x.Bioma)
            .HasColumnName("BIOMA")
            .HasColumnType("NUMBER");

        builder.Property(x => x.Estado)
            .HasColumnName("ESTADO")
            .HasColumnType("VARCHAR2(100)");

        builder.Property(x => x.Pais)
            .HasColumnName("PAIS")
            .HasColumnType("VARCHAR2(100)");

        builder.Property(x => x.Latitude)
            .HasColumnName("LATITUDE")
            .HasColumnType("NUMBER(10,8)");

        builder.Property(x => x.Longitude)
            .HasColumnName("LONGITUDE")
            .HasColumnType("NUMBER(11,8)");

        builder.Property(x => x.AreaKm2)
            .HasColumnName("AREA_KM2")
            .HasColumnType("NUMBER(15,2)");

        builder.Property(x => x.DataCadastro)
            .HasColumnName("DATA_CADASTRO")
            .HasColumnType("TIMESTAMP")
            .HasDefaultValueSql("SYSTIMESTAMP");

        builder.Property(x => x.Ativa)
            .HasColumnName("ATIVA")
            .HasColumnType("NUMBER(1)")
            .HasDefaultValue(1);

        // Relacionamentos
        builder.HasMany(x => x.ImagensSatelitais)
            .WithOne(x => x.RegiaoMonitorada)
            .HasForeignKey(x => x.RegiaoMonitoradaId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.AlertasAmbientais)
            .WithOne(x => x.RegiaoMonitorada)
            .HasForeignKey(x => x.RegiaoMonitoradaId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Historicos)
            .WithOne(x => x.RegiaoMonitorada)
            .HasForeignKey(x => x.RegiaoMonitoradaId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

