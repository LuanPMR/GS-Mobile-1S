using AutoMapper;
using NexusVerde.Application.DTOs;
using NexusVerde.Application.Interfaces;
using NexusVerde.Domain.Entities;

namespace NexusVerde.Application.Services;

/// <summary>
/// Servi�o para gerenciar Regi�es Monitoradas
/// </summary>
public class RegiaoMonitoradaService : IRegiaoMonitoradaService
{
    // Placeholder - ser� implementado quando Infrastructure for referenciado
    public async Task<IEnumerable<RegiaoMonitoradaDto>> ObterTodas()
    {
        throw new NotImplementedException("Servi�o precisa ser instanciado via DI do WebAPI");
    }

    public async Task<RegiaoMonitoradaDto?> ObterPorId(int id)
    {
        throw new NotImplementedException("Servi�o precisa ser instanciado via DI do WebAPI");
    }

    public async Task<IEnumerable<RegiaoMonitoradaDto>> ObterPorBioma(string bioma)
    {
        throw new NotImplementedException("Servi�o precisa ser instanciado via DI do WebAPI");
    }

    public async Task<IEnumerable<RegiaoMonitoradaDto>> ObterPorEstado(string estado)
    {
        throw new NotImplementedException("Servi�o precisa ser instanciado via DI do WebAPI");
    }

    public async Task<RegiaoMonitoradaDto> Criar(CreateRegiaoMonitoradaDto dto)
    {
        throw new NotImplementedException("Servi�o precisa ser instanciado via DI do WebAPI");
    }

    public async Task<RegiaoMonitoradaDto?> Atualizar(int id, UpdateRegiaoMonitoradaDto dto)
    {
        throw new NotImplementedException("Servi�o precisa ser instanciado via DI do WebAPI");
    }

    public async Task<bool> Deletar(int id)
    {
        throw new NotImplementedException("Servi�o precisa ser instanciado via DI do WebAPI");
    }
}




