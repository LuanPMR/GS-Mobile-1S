using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;
using NexusVerde.Application.DTOs;
using NexusVerde.Application.Interfaces;

namespace NexusVerde.WebAPI.Controllers;

/// <summary>
/// Gerencia as fontes de dados satelitais disponíveis para o Nexus Verde.
/// Controla a integração com provedores como Sentinel-2 (ESA/Copernicus) e Landsat (USGS/NASA).
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class FontesSatelitaisController : ControllerBase
{
    private readonly IFonteSatelitalService _service;

    /// <summary>
    /// Construtor do controller de Fontes Satelitais.
    /// </summary>
    /// <param name="service">Serviço de fontes satelitais injetado via DI.</param>
    public FontesSatelitaisController(IFonteSatelitalService service)
    {
        _service = service;
    }

    /// <summary>
    /// Lista todas as fontes satelitais configuradas no Nexus Verde
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<FonteSatelitalDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var fontes = await _service.ObterTodas();
        return Ok(fontes);
    }

    /// <summary>
    /// Obtém detalhes de uma fonte satelital específica
    /// </summary>
    /// <param name="id">ID da fonte satelital</param>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(FonteSatelitalDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var fonte = await _service.ObterPorId(id);
        if (fonte == null) return NotFound();
        return Ok(fonte);
    }

    /// <summary>
    /// Registra uma nova fonte satelital no Nexus Verde (ex: Sentinel-2, Landsat)
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(FonteSatelitalDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateFonteSatelitalDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var fonte = await _service.Criar(dto);
        return CreatedAtAction(nameof(GetById), new { id = fonte.Id }, fonte);
    }

    /// <summary>
    /// Atualiza uma fonte satelital
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(FonteSatelitalDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateFonteSatelitalDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var fonte = await _service.Atualizar(id, dto);
        if (fonte == null) return NotFound();
        return Ok(fonte);
    }

    /// <summary>
    /// Deleta uma fonte satelital
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


