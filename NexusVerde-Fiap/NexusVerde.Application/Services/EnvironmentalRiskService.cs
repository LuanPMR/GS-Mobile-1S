using NexusVerde.Application.DTOs;
using NexusVerde.Application.Interfaces;
using NexusVerde.Domain.Enums;

namespace NexusVerde.Application.Services;

/// <summary>
/// Serviço de análise ambiental baseado em regras
/// </summary>
public class EnvironmentalRiskService : IEnvironmentalRiskService
{
    public async Task<AnaliseAmbientalDto> AnaliserPorRegras(ImagemSatelitalDto imagem)
    {
        // Aqui seria processada a imagem real, por enquanto retorna placeholder
        return await Task.FromResult(new AnaliseAmbientalDto());
    }

    public async Task<IEnumerable<AlertaAmbientalDto>> VerificarAlertas(AnaliseAmbientalDto analise, int regiaoMonitoradaId)
    {
        var alertas = new List<AlertaAmbientalDto>();

        // Regra: Desmatamento
        if (analise.Classificacao == ClassificacaoAmbiental.PossivelDesmatamento)
        {
            alertas.Add(new AlertaAmbientalDto
            {
                RegiaoMonitoradaId = regiaoMonitoradaId,
                TipoAlerta = TipoAlertaAmbiental.Desmatamento,
                NivelRisco = NivelRisco.Critico,
                Mensagem = "Possível desmatamento detectado na região"
            });
        }

        // Regra: Queimada
        if (analise.Classificacao == ClassificacaoAmbiental.PossivelQueimada)
        {
            alertas.Add(new AlertaAmbientalDto
            {
                RegiaoMonitoradaId = regiaoMonitoradaId,
                TipoAlerta = TipoAlertaAmbiental.Queimada,
                NivelRisco = NivelRisco.Critico,
                Mensagem = "Possível queimada detectada na região"
            });
        }

        // Regra: Vegetação baixa
        if (analise.Classificacao == ClassificacaoAmbiental.VegetacaoBaixa)
        {
            alertas.Add(new AlertaAmbientalDto
            {
                RegiaoMonitoradaId = regiaoMonitoradaId,
                TipoAlerta = TipoAlertaAmbiental.VegetacaoBaixa,
                NivelRisco = NivelRisco.Alto,
                Mensagem = "Vegetação em nível preocupante na região"
            });
        }

        return await Task.FromResult(alertas);
    }
}

