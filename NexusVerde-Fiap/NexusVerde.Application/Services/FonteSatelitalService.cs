using AutoMapper;
using NexusVerde.Application.DTOs;
using NexusVerde.Application.Interfaces;
using NexusVerde.Domain.Entities;

namespace NexusVerde.Application.Services;

/// <summary>
/// Serviço para gerenciar Fontes Satelitais
/// </summary>
public class FonteSatelitalService : IFonteSatelitalService
{
    public async Task<IEnumerable<FonteSatelitalDto>> ObterTodas()
    {
        throw new NotImplementedException("Serviço precisa ser instanciado via DI do WebAPI");
    }

    public async Task<FonteSatelitalDto?> ObterPorId(int id)
    {
        throw new NotImplementedException("Serviço precisa ser instanciado via DI do WebAPI");
    }

    public async Task<FonteSatelitalDto> Criar(CreateFonteSatelitalDto dto)
    {
        throw new NotImplementedException("Serviço precisa ser instanciado via DI do WebAPI");
    }

    public async Task<FonteSatelitalDto?> Atualizar(int id, UpdateFonteSatelitalDto dto)
    {
        throw new NotImplementedException("Serviço precisa ser instanciado via DI do WebAPI");
    }

    public async Task<bool> Deletar(int id)
    {
        throw new NotImplementedException("Serviço precisa ser instanciado via DI do WebAPI");
    }
}


