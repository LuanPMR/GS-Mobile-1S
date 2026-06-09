using NexusVerde.Application.DTOs;

namespace NexusVerde.Application.Interfaces;

/// <summary>
/// Interface para serviço de Fontes Satelitais
/// </summary>
public interface IFonteSatelitalService
{
    Task<IEnumerable<FonteSatelitalDto>> ObterTodas();
    Task<FonteSatelitalDto?> ObterPorId(int id);
    Task<FonteSatelitalDto> Criar(CreateFonteSatelitalDto dto);
    Task<FonteSatelitalDto?> Atualizar(int id, UpdateFonteSatelitalDto dto);
    Task<bool> Deletar(int id);
}

