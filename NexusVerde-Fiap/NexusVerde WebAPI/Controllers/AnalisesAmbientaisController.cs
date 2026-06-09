using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;
using NexusVerde.Application.DTOs;
using NexusVerde.Application.Interfaces;

namespace NexusVerde.WebAPI.Controllers;

/// <summary>
/// Gerencia análises espectrais e cálculos de índices ambientais do Nexus Verde.
/// Processa imagens satelitais para gerar NDVI (Normalized Difference Vegetation Index),
/// percentuais de vegetação, solo exposto e áreas queimadas, com classificação de risco.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AnalisesAmbientaisController : ControllerBase
{
    private readonly IAnaliseAmbientalService _service;
    private readonly NexusVerde.Application.Interfaces.IImageAnalysisService _imageAnalysisService;
    private readonly NexusVerde.Application.Interfaces.IAnaliseImagemAmbientalService _analiseImagemService;

    /// <summary>
    /// Construtor do controller de Análises Ambientais.
    /// </summary>
    /// <param name="service">Serviço de análise ambiental injetado via DI.</param>
    /// <param name="imageAnalysisService">Serviço de análise de imagens (injetado via DI).</param>
    /// <param name="analiseImagemService">Serviço de análise de imagem com persistência (injetado via DI).</param>
    public AnalisesAmbientaisController(
        IAnaliseAmbientalService service, 
        NexusVerde.Application.Interfaces.IImageAnalysisService imageAnalysisService,
        NexusVerde.Application.Interfaces.IAnaliseImagemAmbientalService analiseImagemService)
    {
        _service = service;
        _imageAnalysisService = imageAnalysisService;
        _analiseImagemService = analiseImagemService;
    }

    /// <summary>
    /// Analisa uma imagem recebida via multipart/form-data dividindo em grade e classificando por cor média.
    /// </summary>
    [HttpPost("analisar-imagem")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(NexusVerde.Application.DTOs.ResultadoAnaliseImagemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AnalisarImagem(IFormFile imagem, [FromForm] int linhas = 10, [FromForm] int colunas = 10)
    {
        try
        {
            var resultado = await _imageAnalysisService.AnalisarImagemAsync(imagem, linhas, colunas);
            return Ok(resultado);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { erro = ex.Message });
        }
    }

    /// <summary>
    /// Analisa uma imagem e salva o resultado no banco de dados com histórico
    /// </summary>
    [HttpPost("imagens")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AnalisarESalvarImagem(
        IFormFile imagem, 
        [FromForm] int? regiaoMonitoradaId = null,
        [FromForm] int linhas = 10, 
        [FromForm] int colunas = 10)
    {
        try
        {
            var (analise, salva) = await _analiseImagemService.AnalisarESalvarAsync(imagem, regiaoMonitoradaId, linhas, colunas);
            if (salva != null)
            {
                return CreatedAtAction(nameof(ObterImagemPorId), new { id = salva.Id }, new { analise, salva });
            }
            else
            {
                // Salvamento falhou (talvez DB não configurado) - retornar resultado da análise com aviso
                return Ok(new { analise, aviso = "Análise realizada com sucesso, mas o resumo não pôde ser salvo no banco." });
            }
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { erro = ex.Message });
        }
    }

    /// <summary>
    /// Lista todas as análises de imagem salvas
    /// </summary>
    [HttpGet("imagens")]
    [ProducesResponseType(typeof(IEnumerable<AnaliseImagemAmbientalResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListarImagens()
    {
        var analises = await _analiseImagemService.ObterTodasAsync();
        return Ok(analises);
    }

    /// <summary>
    /// Obtém uma análise de imagem por ID
    /// </summary>
    [HttpGet("imagens/{id}")]
    [ProducesResponseType(typeof(AnaliseImagemAmbientalResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObterImagemPorId(int id)
    {
        var analise = await _analiseImagemService.ObterPorIdAsync(id);
        if (analise == null) return NotFound();
        return Ok(analise);
    }

    /// <summary>
    /// Obtém análises de imagem por nível de risco
    /// </summary>
    [HttpGet("imagens/risco/{nivelRisco}")]
    [ProducesResponseType(typeof(IEnumerable<AnaliseImagemAmbientalResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ObterImagensPorRisco(string nivelRisco)
    {
        var analises = await _analiseImagemService.ObterPorRiscoAsync(nivelRisco);
        return Ok(analises);
    }

    /// <summary>
    /// Obtém análises de imagem de uma região específica
    /// </summary>
    [HttpGet("imagens/regiao/{regiaoId}")]
    [ProducesResponseType(typeof(IEnumerable<AnaliseImagemAmbientalResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ObterImagensPorRegiao(int regiaoId)
    {
        var analises = await _analiseImagemService.ObterPorRegiaoAsync(regiaoId);
        return Ok(analises);
    }

    /// <summary>
    /// Deleta uma análise de imagem
    /// </summary>
    [HttpDelete("imagens/{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeletarImagem(int id)
    {
        var result = await _analiseImagemService.DeletarAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }

    /// <summary>
    /// Lista todas as análises ambientais processadas pelo Nexus Verde
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<AnaliseAmbientalDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var analises = await _service.ObterTodas();
        return Ok(analises);
    }

    /// <summary>
    /// Obtém análise ambiental por ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(AnaliseAmbientalDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var analise = await _service.ObterPorId(id);
        if (analise == null) return NotFound();
        return Ok(analise);
    }

    /// <summary>
    /// Obtém análises de uma região monitorada
    /// </summary>
    [HttpGet("regiao/{regiaoId}")]
    [ProducesResponseType(typeof(IEnumerable<AnaliseAmbientalDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByRegiao(int regiaoId)
    {
        var analises = await _service.ObterPorRegiao(regiaoId);
        return Ok(analises);
    }

    /// <summary>
    /// Cria uma nova análise ambiental
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(AnaliseAmbientalDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateAnaliseAmbientalDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var analise = await _service.Criar(dto);
        return CreatedAtAction(nameof(GetById), new { id = analise.Id }, analise);
    }

    /// <summary>
    /// Simula uma análise ambiental com dados fictícios
    /// </summary>
    [HttpPost("simular")]
    [ProducesResponseType(typeof(AnaliseAmbientalDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Simular([FromBody] SimularAnaliseDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var analise = await _service.SimularAnalise(dto);
        return CreatedAtAction(nameof(GetById), new { id = analise.Id }, analise);
    }

    /// <summary>
    /// Deleta uma análise ambiental
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.Deletar(id);
        if (!result) return NotFound();
        return NoContent();
    }
}


