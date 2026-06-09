using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;
using NexusVerde.Application.DTOs;
using NexusVerde.Application.Interfaces;

namespace NexusVerde.WebAPI.Controllers;

/// <summary>
/// Gerencia o histórico completo de eventos de monitoramento do Nexus Verde.
/// Registra todas as análises, alertas e mudanças detectadas em regiões
/// para permitir análise temporal e detecção de tendências ambientais.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class HistoricoMonitoramentoController : ControllerBase
{
    private readonly IHistoricoMonitoramentoService _service;

    /// <summary>
    /// Construtor do controller de Histórico de Monitoramento.
    /// </summary>
    /// <param name="service">Serviço de histórico de monitoramento injetado via DI.</param>
    public HistoricoMonitoramentoController(IHistoricoMonitoramentoService service)
    {
        _service = service;
    }

    /// <summary>
    /// Obtém histórico completo de monitoramento de uma região específica
    /// </summary>
    /// <param name="regiaoId">ID da região para consultar histórico</param>
    [HttpGet("regiao/{regiaoId}")]
    [ProducesResponseType(typeof(IEnumerable<HistoricoMonitoramentoDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByRegiao(int regiaoId)
    {
        var historicos = await _service.ObterPorRegiao(regiaoId);
        return Ok(historicos);
    }

    /// <summary>
    /// Cria um novo registro de histórico
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(HistoricoMonitoramentoDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateHistoricoMonitoramentoDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var historico = await _service.Criar(dto);
        return CreatedAtAction(nameof(GetByRegiao), new { regiaoId = historico.RegiaoMonitoradaId }, historico);
    }

    /// <summary>
    /// Deleta um registro de histórico
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


