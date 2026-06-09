using AutoMapper;
using NexusVerde.Application.DTOs;
using NexusVerde.Application.Interfaces;
using NexusVerde.Domain.Entities;
using NexusVerde.Domain.Enums;

namespace NexusVerde.Application.Services;

/// <summary>
/// Serviço para gerenciar Análises Ambientais
/// </summary>
public class AnaliseAmbientalService : IAnaliseAmbientalService
{
    public async Task<IEnumerable<AnaliseAmbientalDto>> ObterTodas()
    {
        throw new NotImplementedException("Serviço precisa ser instanciado via DI do WebAPI");
    }

    public async Task<AnaliseAmbientalDto?> ObterPorId(int id)
    {
        throw new NotImplementedException("Serviço precisa ser instanciado via DI do WebAPI");
    }

    public async Task<IEnumerable<AnaliseAmbientalDto>> ObterPorRegiao(int regiaoId)
    {
        throw new NotImplementedException("Serviço precisa ser instanciado via DI do WebAPI");
    }

    public async Task<AnaliseAmbientalDto> Criar(CreateAnaliseAmbientalDto dto)
    {
        throw new NotImplementedException("Serviço precisa ser instanciado via DI do WebAPI");
    }

    public async Task<AnaliseAmbientalDto> SimularAnalise(SimularAnaliseDto dto)
    {
        throw new NotImplementedException("Serviço precisa ser instanciado via DI do WebAPI");
    }

    public async Task<bool> Deletar(int id)
    {
        throw new NotImplementedException("Serviço precisa ser instanciado via DI do WebAPI");
    }
}


