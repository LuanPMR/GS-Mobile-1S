using NexusVerde.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace NexusVerde.Infrastructure.Data.Configurations;

public class FonteSatelitalConfiguration : IEntityTypeConfiguration<FonteSatelital>
{
    public void Configure(EntityTypeBuilder<FonteSatelital> builder)
    {
        builder.ToTable("TB_FONTES_SATELITAIS");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id)
            .HasColumnName("ID_FONTE")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.Nome)
            .HasColumnName("NOME")
            .HasColumnType("VARCHAR2(255)")
            .IsRequired();

        builder.Property(x => x.Tipo)
            .HasColumnName("TIPO")
            .HasColumnType("NUMBER");

        builder.Property(x => x.Provedor)
            .HasColumnName("PROVEDOR")
            .HasColumnType("VARCHAR2(255)");

        builder.Property(x => x.ResolucaoMetros)
            .HasColumnName("RESOLUCAO_METROS")
            .HasColumnType("NUMBER(10,2)");

        builder.Property(x => x.FrequenciaRevisitaHoras)
            .HasColumnName("FREQUENCIA_REVISITA_HORAS")
            .HasColumnType("NUMBER(10,2)");

        builder.Property(x => x.Ativo)
            .HasColumnName("ATIVO")
            .HasColumnType("NUMBER(1)")
            .HasDefaultValue(1);

        builder.Property(x => x.DataCadastro)
            .HasColumnName("DATA_CADASTRO")
            .HasColumnType("TIMESTAMP")
            .HasDefaultValueSql("SYSTIMESTAMP");

        // Relacionamentos
        builder.HasMany(x => x.ImagensSatelitais)
            .WithOne(x => x.FonteSatelital)
            .HasForeignKey(x => x.FonteSatelitalId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

