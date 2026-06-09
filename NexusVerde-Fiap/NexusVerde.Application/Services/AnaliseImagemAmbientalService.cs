using System;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using NexusVerde.Application.DTOs;
using NexusVerde.Application.Interfaces;
using NexusVerde.Domain.Entities;
using AutoMapper;

namespace NexusVerde.Application.Services;

/// <summary>
/// Serviço de análise de imagens ambientais com persistência
/// Combina a análise local (ImageAnalysisService) com salvamento em banco de dados
/// Também gera alertas automáticos para análises com risco Alto ou Crítico
/// </summary>
public class AnaliseImagemAmbientalService : IAnaliseImagemAmbientalService
{
    private readonly IImageAnalysisService _imageAnalysisService;
    private readonly IAnaliseImagemAmbientalRepository _repository;
    private readonly IAlertaAmbientalService _alertaService;
    private readonly IMapper _mapper;

    public AnaliseImagemAmbientalService(
        IImageAnalysisService imageAnalysisService,
        IAnaliseImagemAmbientalRepository repository,
        IAlertaAmbientalService alertaService,
        IMapper mapper)
    {
        _imageAnalysisService = imageAnalysisService;
        _repository = repository;
        _alertaService = alertaService;
        _mapper = mapper;
    }

    /// <summary>
    /// Analisa uma imagem e salva o resultado no banco de dados
    /// Se o risco for Alto ou Crítico, gera um alerta automático
    /// Retorna tanto o resultado detalhado quanto o resumo salvo com informações de alerta
    /// </summary>
    public async Task<(ResultadoAnaliseImagemDto analise, AnaliseImagemAmbientalResponseDto? salva)> AnalisarESalvarAsync(
        IFormFile imagem, 
        int? regiaoMonitoradaId = null,
        int linhas = 10, 
        int colunas = 10)
    {
        // 1. Processar a imagem localmente
        var analise = await _imageAnalysisService.AnalisarImagemAsync(imagem, linhas, colunas);

        // 2. Criar entidade a partir da análise
        var nomeArquivo = imagem?.FileName ?? "imagem_analise.png";
        
        var analiseEntity = new AnaliseImagemAmbiental
        {
            NomeArquivo = nomeArquivo,
            DataAnalise = DateTime.UtcNow,
            TotalCelulas = analise.TotalCelulas,
            VegetacaoSaudavel = analise.VegetacaoSaudavel,
            VegetacaoModerada = analise.VegetacaoModerada,
            SoloExposto = analise.SoloExposto,
            PossivelQueimada = analise.PossivelQueimada,
            AreaIndefinida = analise.AreaIndefinida,
            PercentualVegetacaoSaudavel = analise.PercentualVegetacaoSaudavel,
            PercentualVegetacaoModerada = analise.PercentualVegetacaoModerada,
            PercentualSoloExposto = analise.PercentualSoloExposto,
            PercentualPossivelQueimada = analise.PercentualPossivelQueimada,
            PercentualAreaIndefinida = analise.PercentualAreaIndefinida,
            NivelRisco = analise.NivelRisco,
            Resumo = analise.Resumo,
            RegiaoMonitoradaId = regiaoMonitoradaId
        };

        // 3. Tentar salvar no banco; se falhar, capturar e retornar análise com salva = null
        AnaliseImagemAmbiental? salva = null;
        try
        {
            salva = await _repository.AddAsync(analiseEntity);
        }
        catch (Exception)
        {
            // Falha ao salvar no banco não deve quebrar a análise.
            // Idealmente devemos logar a exceção aqui (logger não injetado).
            salva = null;
        }

        // 4. Mapear para DTO de resposta (pode ser null se o salvamento falhar)
        AnaliseImagemAmbientalResponseDto? salvaDto = null;
        if (salva != null)
        {
            salvaDto = _mapper.Map<AnaliseImagemAmbientalResponseDto>(salva);

            // 5. FASE 3: Gerar alerta automático se necessário
            AlertaAmbientalDto? alertaCriado = null;
            
            // Verificar se risco é Alto ou Crítico e gerar alerta
            if (salva.NivelRisco == "Alto" || salva.NivelRisco == "Crítico")
            {
                alertaCriado = await _alertaService.GerarAlertaPorAnaliseAsync(salva, regiaoMonitoradaId);
            }

            // 6. Adicionar informações do alerta ao resultado
            if (alertaCriado != null)
            {
                analise.AlertaGerado = true;
                analise.AlertaId = alertaCriado.Id;
                analise.MensagemAlerta = alertaCriado.Mensagem;
            }
        }

        return (analise, salvaDto);
    }

    /// <summary>
    /// Obtém todas as análises salvas
    /// </summary>
    public async Task<IEnumerable<AnaliseImagemAmbientalResponseDto>> ObterTodasAsync()
    {
        var analises = await _repository.GetAllAsync();
        return _mapper.Map<IEnumerable<AnaliseImagemAmbientalResponseDto>>(analises);
    }

    /// <summary>
    /// Obtém uma análise por ID
    /// </summary>
    public async Task<AnaliseImagemAmbientalResponseDto?> ObterPorIdAsync(int id)
    {
        var analise = await _repository.GetByIdAsync(id);
        return _mapper.Map<AnaliseImagemAmbientalResponseDto?>(analise);
    }

    /// <summary>
    /// Obtém análises de uma região
    /// </summary>
    public async Task<IEnumerable<AnaliseImagemAmbientalResponseDto>> ObterPorRegiaoAsync(int regiaoId)
    {
        var analises = await _repository.GetByRegiaoAsync(regiaoId);
        return _mapper.Map<IEnumerable<AnaliseImagemAmbientalResponseDto>>(analises);
    }

    /// <summary>
    /// Obtém análises por nível de risco
    /// </summary>
    public async Task<IEnumerable<AnaliseImagemAmbientalResponseDto>> ObterPorRiscoAsync(string nivelRisco)
    {
        var analises = await _repository.GetByRiscoAsync(nivelRisco);
        return _mapper.Map<IEnumerable<AnaliseImagemAmbientalResponseDto>>(analises);
    }

    /// <summary>
    /// Deleta uma análise
    /// </summary>
    public async Task<bool> DeletarAsync(int id)
    {
        return await _repository.DeleteAsync(id);
    }

    /// <summary>
    /// Conta o total de análises
    /// </summary>
    public async Task<int> ContarAsync()
    {
        return await _repository.CountAsync();
    }
}

