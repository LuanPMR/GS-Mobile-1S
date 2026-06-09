using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexusVerde.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class EnvironmentalMonitoringSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TB_FONTES_SATELITAIS",
                columns: table => new
                {
                    ID_FONTE = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    NOME = table.Column<string>(type: "VARCHAR2(255)", nullable: false),
                    TIPO = table.Column<decimal>(type: "NUMBER", nullable: false),
                    PROVEDOR = table.Column<string>(type: "VARCHAR2(255)", nullable: true),
                    RESOLUCAO_METROS = table.Column<decimal>(type: "NUMBER(10,2)", nullable: true),
                    FREQUENCIA_REVISITA_HORAS = table.Column<decimal>(type: "NUMBER(10,2)", nullable: true),
                    ATIVO = table.Column<bool>(type: "NUMBER(1)", nullable: false, defaultValue: true),
                    DATA_CADASTRO = table.Column<DateTime>(type: "TIMESTAMP", nullable: false, defaultValueSql: "SYSTIMESTAMP"),
                    CreatedAt = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: true),
                    CreatedBy = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true),
                    UpdatedBy = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TB_FONTES_SATELITAIS", x => x.ID_FONTE);
                });

            migrationBuilder.CreateTable(
                name: "TB_REGIOES_MONITORADAS",
                columns: table => new
                {
                    ID_REGIAO = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    NOME = table.Column<string>(type: "VARCHAR2(255)", nullable: false),
                    BIOMA = table.Column<decimal>(type: "NUMBER", nullable: false),
                    ESTADO = table.Column<string>(type: "VARCHAR2(100)", nullable: true),
                    PAIS = table.Column<string>(type: "VARCHAR2(100)", nullable: true),
                    LATITUDE = table.Column<decimal>(type: "NUMBER(10,8)", nullable: true),
                    LONGITUDE = table.Column<decimal>(type: "NUMBER(11,8)", nullable: true),
                    AREA_KM2 = table.Column<decimal>(type: "NUMBER(15,2)", nullable: true),
                    DATA_CADASTRO = table.Column<DateTime>(type: "TIMESTAMP", nullable: false, defaultValueSql: "SYSTIMESTAMP"),
                    ATIVA = table.Column<bool>(type: "NUMBER(1)", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: true),
                    CreatedBy = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true),
                    UpdatedBy = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TB_REGIOES_MONITORADAS", x => x.ID_REGIAO);
                });

            migrationBuilder.CreateTable(
                name: "TB_HISTORICOS_MONITORAMENTO",
                columns: table => new
                {
                    ID_HISTORICO = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    ID_REGIAO = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    DATA_REGISTRO = table.Column<DateTime>(type: "TIMESTAMP", nullable: false, defaultValueSql: "SYSTIMESTAMP"),
                    NDVI_ANTERIOR = table.Column<decimal>(type: "NUMBER(10,4)", nullable: true),
                    NDVI_ATUAL = table.Column<decimal>(type: "NUMBER(10,4)", nullable: true),
                    VARIACAO_NDVI = table.Column<decimal>(type: "NUMBER(10,4)", nullable: true),
                    OBSERVACAO = table.Column<string>(type: "VARCHAR2(1000)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: true),
                    CreatedBy = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true),
                    UpdatedBy = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TB_HISTORICOS_MONITORAMENTO", x => x.ID_HISTORICO);
                    table.ForeignKey(
                        name: "FK_TB_HISTORICOS_MONITORAMENTO_TB_REGIOES_MONITORADAS_ID_REGIAO",
                        column: x => x.ID_REGIAO,
                        principalTable: "TB_REGIOES_MONITORADAS",
                        principalColumn: "ID_REGIAO",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TB_IMAGENS_SATELITAIS",
                columns: table => new
                {
                    ID_IMAGEM = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    ID_REGIAO = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    ID_FONTE = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    DATA_CAPTURA = table.Column<DateTime>(type: "TIMESTAMP", nullable: false),
                    URL_IMAGEM = table.Column<string>(type: "VARCHAR2(1000)", nullable: true),
                    PERCENTUAL_NUVEM = table.Column<decimal>(type: "NUMBER(5,2)", nullable: true),
                    PROCESSADA = table.Column<bool>(type: "NUMBER(1)", nullable: false, defaultValue: false),
                    DATA_CADASTRO = table.Column<DateTime>(type: "TIMESTAMP", nullable: false, defaultValueSql: "SYSTIMESTAMP"),
                    CreatedAt = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: true),
                    CreatedBy = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true),
                    UpdatedBy = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TB_IMAGENS_SATELITAIS", x => x.ID_IMAGEM);
                    table.ForeignKey(
                        name: "FK_TB_IMAGENS_SATELITAIS_TB_FONTES_SATELITAIS_ID_FONTE",
                        column: x => x.ID_FONTE,
                        principalTable: "TB_FONTES_SATELITAIS",
                        principalColumn: "ID_FONTE",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TB_IMAGENS_SATELITAIS_TB_REGIOES_MONITORADAS_ID_REGIAO",
                        column: x => x.ID_REGIAO,
                        principalTable: "TB_REGIOES_MONITORADAS",
                        principalColumn: "ID_REGIAO",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TB_ANALISES_AMBIENTAIS",
                columns: table => new
                {
                    ID_ANALISE = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    ID_IMAGEM = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    NDVI_MEDIO = table.Column<decimal>(type: "NUMBER(10,4)", nullable: true),
                    PERCENTUAL_VEGETACAO = table.Column<decimal>(type: "NUMBER(5,2)", nullable: true),
                    PERCENTUAL_SOLO_EXPOSTO = table.Column<decimal>(type: "NUMBER(5,2)", nullable: true),
                    PERCENTUAL_AREA_QUEIMADA = table.Column<decimal>(type: "NUMBER(5,2)", nullable: true),
                    CLASSIFICACAO = table.Column<decimal>(type: "NUMBER", nullable: false),
                    NIVEL_RISCO = table.Column<decimal>(type: "NUMBER", nullable: false),
                    RESUMO = table.Column<string>(type: "VARCHAR2(1000)", nullable: true),
                    DATA_ANALISE = table.Column<DateTime>(type: "TIMESTAMP", nullable: false, defaultValueSql: "SYSTIMESTAMP"),
                    CreatedAt = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: true),
                    CreatedBy = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true),
                    UpdatedBy = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TB_ANALISES_AMBIENTAIS", x => x.ID_ANALISE);
                    table.ForeignKey(
                        name: "FK_TB_ANALISES_AMBIENTAIS_TB_IMAGENS_SATELITAIS_ID_IMAGEM",
                        column: x => x.ID_IMAGEM,
                        principalTable: "TB_IMAGENS_SATELITAIS",
                        principalColumn: "ID_IMAGEM",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TB_ALERTAS_AMBIENTAIS",
                columns: table => new
                {
                    ID_ALERTA = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    ID_REGIAO = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    ID_ANALISE = table.Column<int>(type: "NUMBER(10)", nullable: true),
                    TIPO_ALERTA = table.Column<decimal>(type: "NUMBER", nullable: false),
                    NIVEL_RISCO = table.Column<decimal>(type: "NUMBER", nullable: false),
                    MENSAGEM = table.Column<string>(type: "VARCHAR2(1000)", nullable: true),
                    RESOLVIDO = table.Column<bool>(type: "NUMBER(1)", nullable: false, defaultValue: false),
                    DATA_CRIACAO = table.Column<DateTime>(type: "TIMESTAMP", nullable: false, defaultValueSql: "SYSTIMESTAMP"),
                    DATA_RESOLUCAO = table.Column<DateTime>(type: "TIMESTAMP", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: true),
                    CreatedBy = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true),
                    UpdatedBy = table.Column<string>(type: "NVARCHAR2(2000)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TB_ALERTAS_AMBIENTAIS", x => x.ID_ALERTA);
                    table.ForeignKey(
                        name: "FK_TB_ALERTAS_AMBIENTAIS_TB_ANALISES_AMBIENTAIS_ID_ANALISE",
                        column: x => x.ID_ANALISE,
                        principalTable: "TB_ANALISES_AMBIENTAIS",
                        principalColumn: "ID_ANALISE");
                    table.ForeignKey(
                        name: "FK_TB_ALERTAS_AMBIENTAIS_TB_REGIOES_MONITORADAS_ID_REGIAO",
                        column: x => x.ID_REGIAO,
                        principalTable: "TB_REGIOES_MONITORADAS",
                        principalColumn: "ID_REGIAO",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TB_ALERTAS_AMBIENTAIS_ID_ANALISE",
                table: "TB_ALERTAS_AMBIENTAIS",
                column: "ID_ANALISE");

            migrationBuilder.CreateIndex(
                name: "IX_TB_ALERTAS_AMBIENTAIS_ID_REGIAO",
                table: "TB_ALERTAS_AMBIENTAIS",
                column: "ID_REGIAO");

            migrationBuilder.CreateIndex(
                name: "IX_TB_ALERTAS_AMBIENTAIS_NIVEL_RISCO",
                table: "TB_ALERTAS_AMBIENTAIS",
                column: "NIVEL_RISCO");

            migrationBuilder.CreateIndex(
                name: "IX_TB_ALERTAS_AMBIENTAIS_RESOLVIDO",
                table: "TB_ALERTAS_AMBIENTAIS",
                column: "RESOLVIDO");

            migrationBuilder.CreateIndex(
                name: "IX_TB_ANALISES_AMBIENTAIS_ID_IMAGEM",
                table: "TB_ANALISES_AMBIENTAIS",
                column: "ID_IMAGEM",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TB_HISTORICOS_MONITORAMENTO_DATA_REGISTRO",
                table: "TB_HISTORICOS_MONITORAMENTO",
                column: "DATA_REGISTRO",
                descending: new bool[0]);

            migrationBuilder.CreateIndex(
                name: "IX_TB_HISTORICOS_MONITORAMENTO_ID_REGIAO",
                table: "TB_HISTORICOS_MONITORAMENTO",
                column: "ID_REGIAO");

            migrationBuilder.CreateIndex(
                name: "IX_TB_IMAGENS_SATELITAIS_DATA_CAPTURA",
                table: "TB_IMAGENS_SATELITAIS",
                column: "DATA_CAPTURA");

            migrationBuilder.CreateIndex(
                name: "IX_TB_IMAGENS_SATELITAIS_ID_FONTE",
                table: "TB_IMAGENS_SATELITAIS",
                column: "ID_FONTE");

            migrationBuilder.CreateIndex(
                name: "IX_TB_IMAGENS_SATELITAIS_ID_REGIAO",
                table: "TB_IMAGENS_SATELITAIS",
                column: "ID_REGIAO");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TB_ALERTAS_AMBIENTAIS");

            migrationBuilder.DropTable(
                name: "TB_HISTORICOS_MONITORAMENTO");

            migrationBuilder.DropTable(
                name: "TB_ANALISES_AMBIENTAIS");

            migrationBuilder.DropTable(
                name: "TB_IMAGENS_SATELITAIS");

            migrationBuilder.DropTable(
                name: "TB_FONTES_SATELITAIS");

            migrationBuilder.DropTable(
                name: "TB_REGIOES_MONITORADAS");
        }
    }
}
