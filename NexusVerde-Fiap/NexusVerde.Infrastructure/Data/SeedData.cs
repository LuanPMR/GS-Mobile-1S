using NexusVerde.Domain.Entities;
using NexusVerde.Domain.Enums;

namespace NexusVerde.Infrastructure.Data;

/// <summary>
/// Classe responsável por popular dados iniciais (seed data) no banco de dados
/// Fornece exemplos realistas para testes na API e Swagger
/// </summary>
public static class SeedData
{
    public static void Initialize(VeterinaryDbContext context)
    {
        // Se já há dados, não fazer nada
        if (context.RegioesMonitoradas.Any())
        {
            return;
        }

        // Criar Regiões Monitoradas
        var regioes = new List<RegiaoMonitorada>
        {
            new RegiaoMonitorada
            {
                Id = 1,
                Nome = "Amazonia Norte - Estado de Roraima",
                Bioma = TipoBioma.Amazonia,
                Estado = "Roraima",
                Pais = "Brasil",
                Latitude = -2.5m,
                Longitude = -60.5m,
                AreaKm2 = 15000m,
                DataCadastro = DateTime.UtcNow,
                Ativa = true
            },
            new RegiaoMonitorada
            {
                Id = 2,
                Nome = "Cerrado Central - Tocantins",
                Bioma = TipoBioma.Cerrado,
                Estado = "Tocantins",
                Pais = "Brasil",
                Latitude = -10.2m,
                Longitude = -48.3m,
                AreaKm2 = 8500m,
                DataCadastro = DateTime.UtcNow,
                Ativa = true
            },
            new RegiaoMonitorada
            {
                Id = 3,
                Nome = "Mata Atlantica - Litoral de SP",
                Bioma = TipoBioma.MataAtlantica,
                Estado = "São Paulo",
                Pais = "Brasil",
                Latitude = -23.5m,
                Longitude = -45.8m,
                AreaKm2 = 5200m,
                DataCadastro = DateTime.UtcNow,
                Ativa = true
            },
            new RegiaoMonitorada
            {
                Id = 4,
                Nome = "Caatinga - Interior do Ceará",
                Bioma = TipoBioma.Caatinga,
                Estado = "Ceará",
                Pais = "Brasil",
                Latitude = -5.8m,
                Longitude = -39.5m,
                AreaKm2 = 6800m,
                DataCadastro = DateTime.UtcNow,
                Ativa = true
            },
            new RegiaoMonitorada
            {
                Id = 5,
                Nome = "Pantanal - Mato Grosso do Sul",
                Bioma = TipoBioma.Pantanal,
                Estado = "Mato Grosso do Sul",
                Pais = "Brasil",
                Latitude = -19.5m,
                Longitude = -56.5m,
                AreaKm2 = 12000m,
                DataCadastro = DateTime.UtcNow,
                Ativa = true
            }
        };

        context.RegioesMonitoradas.AddRange(regioes);
        context.SaveChanges();

        // Criar Fontes Satelitais
        var fontes = new List<FonteSatelital>
        {
            new FonteSatelital
            {
                Id = 1,
                Nome = "Sentinel-2",
                Tipo = TipoFonteSatelital.SatelitePublico,
                Provedor = "Copernicus/ESA",
                ResolucaoMetros = 10m,
                FrequenciaRevisitaHoras = 120m,
                Ativo = true,
                DataCadastro = DateTime.UtcNow
            },
            new FonteSatelital
            {
                Id = 2,
                Nome = "Landsat 8",
                Tipo = TipoFonteSatelital.SatelitePublico,
                Provedor = "USGS/NASA",
                ResolucaoMetros = 30m,
                FrequenciaRevisitaHoras = 180m,
                Ativo = true,
                DataCadastro = DateTime.UtcNow
            },
            new FonteSatelital
            {
                Id = 3,
                Nome = "Minissatélite Simulado",
                Tipo = TipoFonteSatelital.Simulado,
                Provedor = "Simulação Acadêmica",
                ResolucaoMetros = 5m,
                FrequenciaRevisitaHoras = 48m,
                Ativo = true,
                DataCadastro = DateTime.UtcNow
            }
        };

        context.FontesSatelitais.AddRange(fontes);
        context.SaveChanges();

        // Criar Imagens Satelitais
        var imagens = new List<ImagemSatelital>
        {
            new ImagemSatelital
            {
                Id = 1,
                RegiaoMonitoradaId = 1,
                FonteSatelitalId = 1,
                DataCaptura = DateTime.UtcNow.AddDays(-30),
                UrlImagem = "https://example.com/sentinel2/amazonia_20240305.tif",
                PercentualNuvem = 5m,
                Processada = true,
                DataCadastro = DateTime.UtcNow.AddDays(-30)
            },
            new ImagemSatelital
            {
                Id = 2,
                RegiaoMonitoradaId = 1,
                FonteSatelitalId = 1,
                DataCaptura = DateTime.UtcNow.AddDays(-15),
                UrlImagem = "https://example.com/sentinel2/amazonia_20240320.tif",
                PercentualNuvem = 12m,
                Processada = true,
                DataCadastro = DateTime.UtcNow.AddDays(-15)
            },
            new ImagemSatelital
            {
                Id = 3,
                RegiaoMonitoradaId = 2,
                FonteSatelitalId = 2,
                DataCaptura = DateTime.UtcNow.AddDays(-10),
                UrlImagem = "https://example.com/landsat8/cerrado_20240325.tif",
                PercentualNuvem = 8m,
                Processada = true,
                DataCadastro = DateTime.UtcNow.AddDays(-10)
            },
            new ImagemSatelital
            {
                Id = 4,
                RegiaoMonitoradaId = 3,
                FonteSatelitalId = 3,
                DataCaptura = DateTime.UtcNow.AddDays(-5),
                UrlImagem = "https://example.com/minisatelite/mataatlantica_20240330.tif",
                PercentualNuvem = 2m,
                Processada = true,
                DataCadastro = DateTime.UtcNow.AddDays(-5)
            }
        };

        context.ImagensSatelitais.AddRange(imagens);
        context.SaveChanges();

        // Criar Análises Ambientais
        var analises = new List<AnaliseAmbiental>
        {
            new AnaliseAmbiental
            {
                Id = 1,
                ImagemSatelitalId = 1,
                NdviMedio = 0.72m,
                PercentualVegetacao = 82m,
                PercentualSoloExposto = 12m,
                PercentualAreaQueimada = 0m,
                Classificacao = ClassificacaoAmbiental.VegetacaoSaudavel,
                NivelRisco = NivelRisco.Baixo,
                Resumo = "Floresta em excelente estado de conservação. NDVI elevado indicando vegetação densa e saudável.",
                DataAnalise = DateTime.UtcNow.AddDays(-30)
            },
            new AnaliseAmbiental
            {
                Id = 2,
                ImagemSatelitalId = 2,
                NdviMedio = 0.68m,
                PercentualVegetacao = 78m,
                PercentualSoloExposto = 15m,
                PercentualAreaQueimada = 2m,
                Classificacao = ClassificacaoAmbiental.VegetacaoModerada,
                NivelRisco = NivelRisco.Medio,
                Resumo = "Pequena variação observada. Possível atividade de queimada controlada ou ciclo natural de vegetação.",
                DataAnalise = DateTime.UtcNow.AddDays(-15)
            },
            new AnaliseAmbiental
            {
                Id = 3,
                ImagemSatelitalId = 3,
                NdviMedio = 0.55m,
                PercentualVegetacao = 65m,
                PercentualSoloExposto = 28m,
                PercentualAreaQueimada = 0m,
                Classificacao = ClassificacaoAmbiental.VegetacaoModerada,
                NivelRisco = NivelRisco.Medio,
                Resumo = "Cerrado em estado normal. Padrão esperado para a estação seca. Monitorar evolução.",
                DataAnalise = DateTime.UtcNow.AddDays(-10)
            },
            new AnaliseAmbiental
            {
                Id = 4,
                ImagemSatelitalId = 4,
                NdviMedio = 0.78m,
                PercentualVegetacao = 88m,
                PercentualSoloExposto = 8m,
                PercentualAreaQueimada = 0m,
                Classificacao = ClassificacaoAmbiental.VegetacaoSaudavel,
                NivelRisco = NivelRisco.Baixo,
                Resumo = "Mata Atlântica preservada com alta densidade vegetal. Saúde excelente da floresta.",
                DataAnalise = DateTime.UtcNow.AddDays(-5)
            }
        };

        context.AnalisesAmbientais.AddRange(analises);
        context.SaveChanges();

        // Criar Alertas Ambientais
        var alertasAmbientais = new List<AlertaAmbiental>
        {
            new AlertaAmbiental
            {
                Id = 1,
                RegiaoMonitoradaId = 1,
                AnaliseAmbientalId = 2,
                TipoAlerta = TipoAlertaAmbiental.VariacaoBrusca,
                NivelRisco = NivelRisco.Medio,
                Mensagem = "Variação de NDVI detectada na região de Roraima. Verificar causas (possível desmatamento ou ciclo natural).",
                Resolvido = false,
                DataCriacao = DateTime.UtcNow.AddDays(-15)
            },
            new AlertaAmbiental
            {
                Id = 2,
                RegiaoMonitoradaId = 2,
                AnaliseAmbientalId = 3,
                TipoAlerta = TipoAlertaAmbiental.Monitoramento,
                NivelRisco = NivelRisco.Medio,
                Mensagem = "Cerrado em padrão esperado para estação. Continuar monitoramento regular.",
                Resolvido = false,
                DataCriacao = DateTime.UtcNow.AddDays(-10)
            },
            new AlertaAmbiental
            {
                Id = 3,
                RegiaoMonitoradaId = 1,
                AnaliseAmbientalId = 2,
                TipoAlerta = TipoAlertaAmbiental.NuvemAlta,
                NivelRisco = NivelRisco.Baixo,
                Mensagem = "Cobertura de nuvem detectada em 12% da imagem. Pode afetar próximas análises espectrais.",
                Resolvido = true,
                DataCriacao = DateTime.UtcNow.AddDays(-15),
                DataResolucao = DateTime.UtcNow.AddDays(-14)
            }
        };

        context.AlertasAmbientais.AddRange(alertasAmbientais);
        context.SaveChanges();

        // Criar Histórico de Monitoramento
        var historicos = new List<HistoricoMonitoramento>
        {
            new HistoricoMonitoramento
            {
                Id = 1,
                RegiaoMonitoradaId = 1,
                DataRegistro = DateTime.UtcNow.AddDays(-30),
                NdviAnterior = 0.74m,
                NdviAtual = 0.72m,
                VariacaoNdvi = -0.02m,
                Observacao = "Leve redução em NDVI compatível com variações sazonais."
            },
            new HistoricoMonitoramento
            {
                Id = 2,
                RegiaoMonitoradaId = 1,
                DataRegistro = DateTime.UtcNow.AddDays(-15),
                NdviAnterior = 0.72m,
                NdviAtual = 0.68m,
                VariacaoNdvi = -0.04m,
                Observacao = "Redução mais pronunciada, possível indício de desmatamento ou queimada localizada."
            },
            new HistoricoMonitoramento
            {
                Id = 3,
                RegiaoMonitoradaId = 2,
                DataRegistro = DateTime.UtcNow.AddDays(-10),
                NdviAnterior = 0.58m,
                NdviAtual = 0.55m,
                VariacaoNdvi = -0.03m,
                Observacao = "Padrão esperado para período de estiagem no cerrado."
            },
            new HistoricoMonitoramento
            {
                Id = 4,
                RegiaoMonitoradaId = 3,
                DataRegistro = DateTime.UtcNow.AddDays(-5),
                NdviAnterior = 0.76m,
                NdviAtual = 0.78m,
                VariacaoNdvi = 0.02m,
                Observacao = "Melhora detectada. Possível recuperação pós-chuvas ou regeneração natural."
            }
        };

        context.HistoricosMonitoramento.AddRange(historicos);
        context.SaveChanges();
    }
}

