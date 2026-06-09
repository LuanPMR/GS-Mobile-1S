using AutoMapper;
using NexusVerde.Application.DTOs;
using NexusVerde.Application.Interfaces;
using NexusVerde.Domain.Entities;
using NexusVerde.Domain.Enums;

namespace NexusVerde.Application.Services;

/// <summary>
/// Serviço para gerenciar Alertas Ambientais
/// Responsável por criar, listar, atualizar e deletar alertas
/// Também gera alertas automáticos baseado em análises de imagens
/// </summary>
public class AlertaAmbientalService : IAlertaAmbientalService
{
    private readonly IAlertaAmbientalRepository _repository;
    private readonly IMapper _mapper;

    public AlertaAmbientalService(IAlertaAmbientalRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    /// <summary>
    /// Obtém todos os alertas ambientais
    /// </summary>
    public async Task<IEnumerable<AlertaAmbientalDto>> ObterTodas()
    {
        var alertas = await _repository.ObterTodosAsync();
        return _mapper.Map<IEnumerable<AlertaAmbientalDto>>(alertas);
    }

    /// <summary>
    /// Obtém um alerta específico por ID
    /// </summary>
    public async Task<AlertaAmbientalDto?> ObterPorId(int id)
    {
        var alerta = await _repository.ObterPorIdAsync(id);
        return alerta != null ? _mapper.Map<AlertaAmbientalDto>(alerta) : null;
    }

    /// <summary>
    /// Obtém alertas de uma região monitorada
    /// </summary>
    public async Task<IEnumerable<AlertaAmbientalDto>> ObterPorRegiao(int regiaoId)
    {
        var alertas = await _repository.ObterPorRegiaoAsync(regiaoId);
        return _mapper.Map<IEnumerable<AlertaAmbientalDto>>(alertas);
    }

    /// <summary>
    /// Obtém alertas por nível de risco
    /// </summary>
    public async Task<IEnumerable<AlertaAmbientalDto>> ObterPorNivelRisco(string nivelRisco)
    {
        var alertas = await _repository.ObterPorNivelRiscoAsync(nivelRisco);
        return _mapper.Map<IEnumerable<AlertaAmbientalDto>>(alertas);
    }

    /// <summary>
    /// Obtém alertas pendentes (não resolvidos)
    /// </summary>
    public async Task<IEnumerable<AlertaAmbientalDto>> ObterPendentes()
    {
        var alertas = await _repository.ObterPendentesAsync();
        return _mapper.Map<IEnumerable<AlertaAmbientalDto>>(alertas);
    }

    /// <summary>
    /// Cria um novo alerta ambiental
    /// </summary>
    public async Task<AlertaAmbientalDto> Criar(CreateAlertaAmbientalDto dto)
    {
        var alerta = _mapper.Map<AlertaAmbiental>(dto);
        var criado = await _repository.CriarAsync(alerta);
        return _mapper.Map<AlertaAmbientalDto>(criado);
    }

    /// <summary>
    /// Atualiza um alerta existente
    /// </summary>
    public async Task<AlertaAmbientalDto?> Atualizar(int id, UpdateAlertaAmbientalDto dto)
    {
        var alerta = await _repository.ObterPorIdAsync(id);
        if (alerta == null)
            return null;

        if (dto.TipoAlerta.HasValue)
            alerta.TipoAlerta = dto.TipoAlerta.Value;

        if (dto.NivelRisco.HasValue)
            alerta.NivelRisco = dto.NivelRisco.Value;

        if (dto.Mensagem != null)
            alerta.Mensagem = dto.Mensagem;

        if (dto.Resolvido.HasValue)
        {
            alerta.Resolvido = dto.Resolvido.Value;
            if (dto.Resolvido.Value && alerta.DataResolucao == null)
                alerta.DataResolucao = DateTime.UtcNow;
        }

        var atualizado = await _repository.AtualizarAsync(alerta);
        return _mapper.Map<AlertaAmbientalDto>(atualizado);
    }

    /// <summary>
    /// Deleta um alerta
    /// </summary>
    public async Task<bool> Deletar(int id)
    {
        return await _repository.DeletarAsync(id);
    }

    /// <summary>
    /// Marca um alerta como resolvido
    /// </summary>
    public async Task<AlertaAmbientalDto?> ResolverAsync(int id)
    {
        var alerta = await _repository.ObterPorIdAsync(id);
        if (alerta == null)
            return null;

        alerta.Resolvido = true;
        alerta.DataResolucao = DateTime.UtcNow;

        var atualizado = await _repository.AtualizarAsync(alerta);
        return _mapper.Map<AlertaAmbientalDto>(atualizado);
    }

    /// <summary>
    /// Gera um alerta ambiental automático baseado na análise de imagem
    /// Avalia as regras de risco e cria o alerta se necessário
    /// </summary>
    public async Task<AlertaAmbientalDto?> GerarAlertaPorAnaliseAsync(AnaliseImagemAmbiental analise, int? regiaoMonitoradaId = null)
    {
        if (analise == null)
            return null;

        AlertaAmbiental? alerta = null;

        // Regra 1: Possível Queimada (>= 10% ou risco Alto/Crítico)
        if (analise.PercentualPossivelQueimada >= 10)
        {
            alerta = new AlertaAmbiental
            {
                RegiaoMonitoradaId = regiaoMonitoradaId ?? 1,
                AnaliseImagemAmbientalId = analise.Id,
                TipoAlerta = TipoAlertaAmbiental.PossivelQueimada,
                NivelRisco = analise.NivelRisco == "Critico" || analise.NivelRisco == "Crítico" ? NivelRisco.Critico : NivelRisco.Alto,
                Mensagem = "Possível foco de queimada detectado na imagem analisada.",
                Resolvido = false,
                DataCriacao = DateTime.UtcNow
            };
        }

        // Regra 2: Possível Desmatamento (>= 25% solo exposto)
        if (analise.PercentualSoloExposto >= 25 && alerta == null)
        {
            alerta = new AlertaAmbiental
            {
                RegiaoMonitoradaId = regiaoMonitoradaId ?? 1,
                AnaliseImagemAmbientalId = analise.Id,
                TipoAlerta = TipoAlertaAmbiental.PossivelDesmatamento,
                NivelRisco = NivelRisco.Alto,
                Mensagem = "Área com alto percentual de solo exposto, indicando possível desmatamento.",
                Resolvido = false,
                DataCriacao = DateTime.UtcNow
            };
        }

        // Regra 3: Risco Crítico
        if ((analise.NivelRisco == "Critico" || analise.NivelRisco == "Crítico") && alerta == null)
        {
            alerta = new AlertaAmbiental
            {
                RegiaoMonitoradaId = regiaoMonitoradaId ?? 1,
                AnaliseImagemAmbientalId = analise.Id,
                TipoAlerta = TipoAlertaAmbiental.AreaCritica,
                NivelRisco = NivelRisco.Critico,
                Mensagem = "Análise classificada como crítica. Recomenda-se verificação urgente da área.",
                Resolvido = false,
                DataCriacao = DateTime.UtcNow
            };
        }

        // Salvar alerta se foi criado
        if (alerta != null)
        {
            var criado = await _repository.CriarAsync(alerta);
            return _mapper.Map<AlertaAmbientalDto>(criado);
        }

        return null;
    }
}



