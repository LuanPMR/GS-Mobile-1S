using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;
using NexusVerde.Application.DTOs;
using NexusVerde.Application.Interfaces;

namespace NexusVerde.WebAPI.Controllers;

/// <summary>
/// Gerencia regiões ambientais sob monitoramento contínuo com dados satelitais.
/// Permite criar, consultar, atualizar e remover áreas de interesse para análise ambiental.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class RegioesMonitoradasController : ControllerBase
{
    private readonly IRegiaoMonitoradaService _service;

    /// <summary>
    /// Construtor do controller de Regiões Monitoradas.
    /// </summary>
    /// <param name="service">Serviço de regiões monitoradas injetado via DI.</param>
    public RegioesMonitoradasController(IRegiaoMonitoradaService service)
    {
        _service = service;
    }

    /// <summary>
    /// Lista todas as regiões monitoradas pelo Nexus Verde
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<RegiaoMonitoradaDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var regioes = await _service.ObterTodas();
        return Ok(regioes);
    }

    /// <summary>
    /// Obtém os detalhes completos de uma região monitorada específica
    /// </summary>
    /// <param name="id">ID da região monitorada</param>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(RegiaoMonitoradaDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var regiao = await _service.ObterPorId(id);
        if (regiao == null) return NotFound();
        return Ok(regiao);
    }

    /// <summary>
    /// Filtra regiões monitoradas pelo bioma (Amazônia, Cerrado, Caatinga, etc.)
    /// </summary>
    /// <param name="bioma">Nome do bioma para filtro</param>
    [HttpGet("bioma/{bioma}")]
    [ProducesResponseType(typeof(IEnumerable<RegiaoMonitoradaDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByBioma(string bioma)
    {
        var regioes = await _service.ObterPorBioma(bioma);
        return Ok(regioes);
    }

    /// <summary>
    /// Filtra regiões monitoradas pelo estado (localização geográfica)
    /// </summary>
    /// <param name="estado">Sigla ou nome do estado</param>
    [HttpGet("estado/{estado}")]
    [ProducesResponseType(typeof(IEnumerable<RegiaoMonitoradaDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByEstado(string estado)
    {
        var regioes = await _service.ObterPorEstado(estado);
        return Ok(regioes);
    }

    /// <summary>
    /// Registra uma nova região para monitoramento ambiental contínuo
    /// </summary>
    /// <param name="dto">Dados da região a ser monitorada</param>
    [HttpPost]
    [ProducesResponseType(typeof(RegiaoMonitoradaDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateRegiaoMonitoradaDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var regiao = await _service.Criar(dto);
        return CreatedAtAction(nameof(GetById), new { id = regiao.Id }, regiao);
    }

    /// <summary>
    /// Atualiza informações de uma região monitorada
    /// </summary>
    /// <param name="id">ID da região a atualizar</param>
    /// <param name="dto">Novos dados da região</param>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(RegiaoMonitoradaDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateRegiaoMonitoradaDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var regiao = await _service.Atualizar(id, dto);
        if (regiao == null) return NotFound();
        return Ok(regiao);
    }

    /// <summary>
    /// Remove uma região do monitoramento do Nexus Verde
    /// </summary>
    /// <param name="id">ID da região a remover</param>
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


