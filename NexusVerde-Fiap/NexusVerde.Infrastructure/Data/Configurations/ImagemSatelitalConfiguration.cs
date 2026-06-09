using NexusVerde.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace NexusVerde.Infrastructure.Data.Configurations;

public class ImagemSatelitalConfiguration : IEntityTypeConfiguration<ImagemSatelital>
{
    public void Configure(EntityTypeBuilder<ImagemSatelital> builder)
    {
        builder.ToTable("TB_IMAGENS_SATELITAIS");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id)
            .HasColumnName("ID_IMAGEM")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.RegiaoMonitoradaId)
            .HasColumnName("ID_REGIAO")
            .IsRequired();

        builder.Property(x => x.FonteSatelitalId)
            .HasColumnName("ID_FONTE")
            .IsRequired();

        builder.Property(x => x.DataCaptura)
            .HasColumnName("DATA_CAPTURA")
            .HasColumnType("TIMESTAMP")
            .IsRequired();

        builder.Property(x => x.UrlImagem)
            .HasColumnName("URL_IMAGEM")
            .HasColumnType("VARCHAR2(1000)");

        builder.Property(x => x.PercentualNuvem)
            .HasColumnName("PERCENTUAL_NUVEM")
            .HasColumnType("NUMBER(5,2)");

        builder.Property(x => x.Processada)
            .HasColumnName("PROCESSADA")
            .HasColumnType("NUMBER(1)")
            .HasDefaultValue(0);

        builder.Property(x => x.DataCadastro)
            .HasColumnName("DATA_CADASTRO")
            .HasColumnType("TIMESTAMP")
            .HasDefaultValueSql("SYSTIMESTAMP");

        // Índices
        builder.HasIndex(x => x.RegiaoMonitoradaId);
        builder.HasIndex(x => x.FonteSatelitalId);
        builder.HasIndex(x => x.DataCaptura);

        // Relacionamentos
        builder.HasOne(x => x.AnaliseAmbiental)
            .WithOne(x => x.ImagemSatelital)
            .HasForeignKey<AnaliseAmbiental>(x => x.ImagemSatelitalId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

