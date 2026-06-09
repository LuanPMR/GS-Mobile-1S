using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;
using NexusVerde.Application.DTOs;
using NexusVerde.Application.Interfaces;

namespace NexusVerde.WebAPI.Controllers;

/// <summary>
/// Gerencia imagens satelitais capturadas e processadas pelo Nexus Verde.
/// Armazena dados de captura incluindo data, cobertura de nuvem e status de processamento.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ImagensSatelitaisController : ControllerBase
{
    private readonly IImagemSatelitalService _service;

    /// <summary>
    /// Construtor do controller de Imagens Satelitais.
    /// </summary>
    /// <param name="service">Serviço de imagens satelitais injetado via DI.</param>
    public ImagensSatelitaisController(IImagemSatelitalService service)
    {
        _service = service;
    }

    /// <summary>
    /// Lista todas as imagens satelitais armazenadas no Nexus Verde
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ImagemSatelitalDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var imagens = await _service.ObterTodas();
        return Ok(imagens);
    }

    /// <summary>
    /// Obtém informações detalhadas de uma imagem satelital específica
    /// </summary>
    /// <param name="id">ID da imagem satelital</param>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ImagemSatelitalDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var imagem = await _service.ObterPorId(id);
        if (imagem == null) return NotFound();
        return Ok(imagem);
    }

    /// <summary>
    /// Obtém imagens de uma região monitorada
    /// </summary>
    [HttpGet("regiao/{regiaoId}")]
    [ProducesResponseType(typeof(IEnumerable<ImagemSatelitalDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByRegiao(int regiaoId)
    {
        var imagens = await _service.ObterPorRegiao(regiaoId);
        return Ok(imagens);
    }

    /// <summary>
    /// Cria uma nova imagem satelital
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ImagemSatelitalDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateImagemSatelitalDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var imagem = await _service.Criar(dto);
        return CreatedAtAction(nameof(GetById), new { id = imagem.Id }, imagem);
    }

    /// <summary>
    /// Atualiza uma imagem satelital
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ImagemSatelitalDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateImagemSatelitalDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var imagem = await _service.Atualizar(id, dto);
        if (imagem == null) return NotFound();
        return Ok(imagem);
    }

    /// <summary>
    /// Deleta uma imagem satelital
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


