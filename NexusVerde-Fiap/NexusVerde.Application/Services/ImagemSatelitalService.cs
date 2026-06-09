using AutoMapper;
using NexusVerde.Application.DTOs;
using NexusVerde.Application.Interfaces;
using NexusVerde.Domain.Entities;

namespace NexusVerde.Application.Services;

/// <summary>
/// Serviço para gerenciar Imagens Satelitais
/// </summary>
public class ImagemSatelitalService : IImagemSatelitalService
{
    public async Task<IEnumerable<ImagemSatelitalDto>> ObterTodas()
    {
        throw new NotImplementedException("Serviço precisa ser instanciado via DI do WebAPI");
    }

    public async Task<ImagemSatelitalDto?> ObterPorId(int id)
    {
        throw new NotImplementedException("Serviço precisa ser instanciado via DI do WebAPI");
    }

    public async Task<IEnumerable<ImagemSatelitalDto>> ObterPorRegiao(int regiaoId)
    {
        throw new NotImplementedException("Serviço precisa ser instanciado via DI do WebAPI");
    }

    public async Task<ImagemSatelitalDto> Criar(CreateImagemSatelitalDto dto)
    {
        throw new NotImplementedException("Serviço precisa ser instanciado via DI do WebAPI");
    }

    public async Task<ImagemSatelitalDto?> Atualizar(int id, UpdateImagemSatelitalDto dto)
    {
        throw new NotImplementedException("Serviço precisa ser instanciado via DI do WebAPI");
    }

    public async Task<bool> Deletar(int id)
    {
        throw new NotImplementedException("Serviço precisa ser instanciado via DI do WebAPI");
    }
}


