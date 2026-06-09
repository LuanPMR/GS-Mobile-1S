using AutoMapper;
using NexusVerde.Application.DTOs;
using NexusVerde.Application.Interfaces;
using NexusVerde.Domain.Entities;

namespace NexusVerde.Application.Services;

/// <summary>
/// Serviço para gerenciar Histórico de Monitoramento
/// </summary>
public class HistoricoMonitoramentoService : IHistoricoMonitoramentoService
{
    public async Task<IEnumerable<HistoricoMonitoramentoDto>> ObterPorRegiao(int regiaoId)
    {
        throw new NotImplementedException("Serviço precisa ser instanciado via DI do WebAPI");
    }

    public async Task<HistoricoMonitoramentoDto> Criar(CreateHistoricoMonitoramentoDto dto)
    {
        throw new NotImplementedException("Serviço precisa ser instanciado via DI do WebAPI");
    }

    public async Task<bool> Deletar(int id)
    {
        throw new NotImplementedException("Serviço precisa ser instanciado via DI do WebAPI");
    }
}


