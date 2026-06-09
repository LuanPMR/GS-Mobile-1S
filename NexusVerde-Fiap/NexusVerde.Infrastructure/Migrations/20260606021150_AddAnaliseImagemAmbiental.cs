using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexusVerde.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAnaliseImagemAmbiental : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TB_ANALISES_IMAGEM_AMBIENTAL",
                columns: table => new
                {
                    ID_ANALISE_IMAGEM = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    NOME_ARQUIVO = table.Column<string>(type: "NVARCHAR2(500)", maxLength: 500, nullable: false),
                    DATA_ANALISE = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false, defaultValue: new DateTime(2026, 6, 6, 2, 11, 50, 292, DateTimeKind.Utc).AddTicks(794)),
                    TOTAL_CELULAS = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    VEGETACAO_SAUDAVEL = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    VEGETACAO_MODERADA = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    SOLO_EXPOSTO = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    POSSIVEL_QUEIMADA = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    AREA_INDEFINIDA = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    PERCENTUAL_VEGETACAO_SAUDAVEL = table.Column<double>(type: "BINARY_DOUBLE", nullable: false),
                    PERCENTUAL_VEGETACAO_MODERADA = table.Column<double>(type: "BINARY_DOUBLE", nullable: false),
                    PERCENTUAL_SOLO_EXPOSTO = table.Column<double>(type: "BINARY_DOUBLE", nullable: false),
                    PERCENTUAL_POSSIVEL_QUEIMADA = table.Column<double>(type: "BINARY_DOUBLE", nullable: false),
                    PERCENTUAL_AREA_INDEFINIDA = table.Column<double>(type: "BINARY_DOUBLE", nullable: false),
                    NIVEL_RISCO = table.Column<string>(type: "NVARCHAR2(50)", maxLength: 50, nullable: false, defaultValue: "Baixo"),
                    RESUMO = table.Column<string>(type: "NVARCHAR2(1000)", maxLength: 1000, nullable: false),
                    ID_REGIAO_MONITORADA = table.Column<int>(type: "NUMBER(10)", nullable: true),
                    DATA_CRIACAO = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false, defaultValue: new DateTime(2026, 6, 6, 2, 11, 50, 292, DateTimeKind.Utc).AddTicks(4337)),
                    DATA_ATUALIZACAO = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: true),
                    CRIADO_POR = table.Column<string>(type: "NVARCHAR2(255)", maxLength: 255, nullable: true),
                    ATUALIZADO_POR = table.Column<string>(type: "NVARCHAR2(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TB_ANALISES_IMAGEM_AMBIENTAL", x => x.ID_ANALISE_IMAGEM);
                    table.ForeignKey(
                        name: "FK_TB_ANALISES_IMAGEM_AMBIENTAL_TB_REGIOES_MONITORADAS_ID_REGIAO_MONITORADA",
                        column: x => x.ID_REGIAO_MONITORADA,
                        principalTable: "TB_REGIOES_MONITORADAS",
                        principalColumn: "ID_REGIAO",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TB_ANALISES_IMAGEM_AMBIENTAL_ID_REGIAO_MONITORADA",
                table: "TB_ANALISES_IMAGEM_AMBIENTAL",
                column: "ID_REGIAO_MONITORADA");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TB_ANALISES_IMAGEM_AMBIENTAL");
        }
    }
}
