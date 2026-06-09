using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;
using NexusVerde.Application.DTOs;
using NexusVerde.Application.Interfaces;

namespace NexusVerde.WebAPI.Controllers;

/// <summary>
/// Gerencia alertas ambientais gerados pelo Nexus Verde.
/// Emite notificações sobre desmatamento, queimadas, variações anormais de vegetação
/// e outros eventos ambientais críticos baseados em análise de dados satelitais.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AlertasAmbientaisController : ControllerBase
{
    private readonly IAlertaAmbientalService _service;

    /// <summary>
    /// Construtor do controller de Alertas Ambientais.
    /// </summary>
    /// <param name="service">Serviço de alerta ambiental injetado via DI.</param>
    public AlertasAmbientaisController(IAlertaAmbientalService service)
    {
        _service = service;
    }

    /// <summary>
    /// Lista todos os alertas ambientais gerados pelo Nexus Verde
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<AlertaAmbientalDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var alertas = await _service.ObterTodas();
        return Ok(alertas);
    }

    /// <summary>
    /// Obtém alerta ambiental por ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(AlertaAmbientalDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var alerta = await _service.ObterPorId(id);
        if (alerta == null) return NotFound();
        return Ok(alerta);
    }

    /// <summary>
    /// Obtém alertas de uma região monitorada
    /// </summary>
    [HttpGet("regiao/{regiaoId}")]
    [ProducesResponseType(typeof(IEnumerable<AlertaAmbientalDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByRegiao(int regiaoId)
    {
        var alertas = await _service.ObterPorRegiao(regiaoId);
        return Ok(alertas);
    }

    /// <summary>
    /// Obtém alertas por nível de risco
    /// </summary>
    [HttpGet("risco/{nivelRisco}")]
    [ProducesResponseType(typeof(IEnumerable<AlertaAmbientalDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByNivelRisco(string nivelRisco)
    {
        var alertas = await _service.ObterPorNivelRisco(nivelRisco);
        return Ok(alertas);
    }

    /// <summary>
    /// Obtém alertas pendentes (não resolvidos)
    /// </summary>
    [HttpGet("pendentes")]
    [ProducesResponseType(typeof(IEnumerable<AlertaAmbientalDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPendentes()
    {
        var alertas = await _service.ObterPendentes();
        return Ok(alertas);
    }

    /// <summary>
    /// Cria um novo alerta ambiental
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(AlertaAmbientalDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateAlertaAmbientalDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var alerta = await _service.Criar(dto);
        return CreatedAtAction(nameof(GetById), new { id = alerta.Id }, alerta);
    }

    /// <summary>
    /// Atualiza um alerta ambiental
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(AlertaAmbientalDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateAlertaAmbientalDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var alerta = await _service.Atualizar(id, dto);
        if (alerta == null) return NotFound();
        return Ok(alerta);
    }

    /// <summary>
    /// Deleta um alerta ambiental
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

    /// <summary>
    /// Marca um alerta como resolvido
    /// </summary>
    [HttpPut("{id}/resolver")]
    [ProducesResponseType(typeof(AlertaAmbientalDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Resolver(int id)
    {
        var alerta = await _service.ResolverAsync(id);
        if (alerta == null) return NotFound();
        return Ok(alerta);
    }
}


