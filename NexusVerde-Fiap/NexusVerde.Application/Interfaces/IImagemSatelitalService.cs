using NexusVerde.Application.DTOs;

namespace NexusVerde.Application.Interfaces;

/// <summary>
/// Interface para serviço de Imagens Satelitais
/// </summary>
public interface IImagemSatelitalService
{
    Task<IEnumerable<ImagemSatelitalDto>> ObterTodas();
    Task<ImagemSatelitalDto?> ObterPorId(int id);
    Task<IEnumerable<ImagemSatelitalDto>> ObterPorRegiao(int regiaoId);
    Task<ImagemSatelitalDto> Criar(CreateImagemSatelitalDto dto);
    Task<ImagemSatelitalDto?> Atualizar(int id, UpdateImagemSatelitalDto dto);
    Task<bool> Deletar(int id);
}

