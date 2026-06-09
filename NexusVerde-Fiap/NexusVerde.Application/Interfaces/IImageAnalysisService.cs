using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using NexusVerde.Application.DTOs;

namespace NexusVerde.Application.Interfaces;

/// <summary>
/// Serviço de análise de imagem — camada Application
/// </summary>
public interface IImageAnalysisService
{
    Task<ResultadoAnaliseImagemDto> AnalisarImagemAsync(IFormFile imagem, int linhas = 10, int colunas = 10);
}


