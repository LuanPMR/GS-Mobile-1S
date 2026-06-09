using System;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using Microsoft.AspNetCore.Http;
using NexusVerde.Application.DTOs;
using NexusVerde.Application.Interfaces;
using NexusVerde.Domain.Enums;

namespace NexusVerde.Application.Services;

public class ImageAnalysisService : IImageAnalysisService
{
    public async Task<ResultadoAnaliseImagemDto> AnalisarImagemAsync(IFormFile imagem, int linhas = 10, int colunas = 10)
    {
        if (imagem == null) throw new ArgumentException("Imagem não enviada.");
        if (linhas < 1 || colunas < 1) throw new ArgumentException("Linhas e colunas devem ser maiores que zero.");
        if (string.IsNullOrEmpty(imagem.ContentType) || !imagem.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
            throw new ArgumentException("Arquivo enviado não é uma imagem.");

        try
        {
            using var stream = imagem.OpenReadStream();
            using var image = await Image.LoadAsync<Rgba32>(stream);

            // Garantir que não haja divisão inválida
            int actualLinhas = Math.Min(linhas, image.Height);
            int actualColunas = Math.Min(colunas, image.Width);
            
            if (actualLinhas < 1) actualLinhas = 1;
            if (actualColunas < 1) actualColunas = 1;

            int cellWidth = image.Width / actualColunas;
            int cellHeight = image.Height / actualLinhas;

            var resultado = new ResultadoAnaliseImagemDto();

            for (int row = 0; row < actualLinhas; row++)
            {
                for (int col = 0; col < actualColunas; col++)
                {
                    int startX = col * cellWidth;
                    int startY = row * cellHeight;
                    int endX = (col == actualColunas - 1) ? image.Width : (col + 1) * cellWidth;
                    int endY = (row == actualLinhas - 1) ? image.Height : (row + 1) * cellHeight;

                    long sumR = 0, sumG = 0, sumB = 0;
                    long count = 0;

                    for (int y = startY; y < endY && y < image.Height; y++)
                    {
                        for (int x = startX; x < endX && x < image.Width; x++)
                        {
                            var p = image[x, y];
                            sumR += p.R;
                            sumG += p.G;
                            sumB += p.B;
                            count++;
                        }
                    }

                    if (count == 0) count = 1;

                    int avgR = (int)(sumR / count);
                    int avgG = (int)(sumG / count);
                    int avgB = (int)(sumB / count);

                    string hex = $"#{avgR:X2}{avgG:X2}{avgB:X2}";

                    var classificacao = ClassifyCell(avgR, avgG, avgB);

                    var celula = new CelulaAnalisadaDto
                    {
                        Linha = row + 1,
                        Coluna = col + 1,
                        CorMedia = hex,
                        Classificacao = classificacao.ToString()
                    };

                    resultado.Celulas.Add(celula);

                    switch (classificacao)
                    {
                        case ClassificacaoCelula.VegetacaoSaudavel: resultado.VegetacaoSaudavel++; break;
                        case ClassificacaoCelula.VegetacaoModerada: resultado.VegetacaoModerada++; break;
                        case ClassificacaoCelula.SoloExposto: resultado.SoloExposto++; break;
                        case ClassificacaoCelula.PossivelQueimada: resultado.PossivelQueimada++; break;
                        case ClassificacaoCelula.NuvemOuAreaIndefinida: resultado.AreaIndefinida++; break;
                    }

                    resultado.TotalCelulas++;
                }
            }

            // percentuais
            int total = resultado.TotalCelulas == 0 ? 1 : resultado.TotalCelulas;
            resultado.PercentualVegetacaoSaudavel = resultado.VegetacaoSaudavel * 100.0 / total;
            resultado.PercentualVegetacaoModerada = resultado.VegetacaoModerada * 100.0 / total;
            resultado.PercentualSoloExposto = resultado.SoloExposto * 100.0 / total;
            resultado.PercentualPossivelQueimada = resultado.PossivelQueimada * 100.0 / total;
            resultado.PercentualAreaIndefinida = resultado.AreaIndefinida * 100.0 / total;

            resultado.NivelRisco = CalculateRisk(resultado);
            resultado.Resumo = BuildResumo(resultado);

            return resultado;
        }
        catch (SixLabors.ImageSharp.UnknownImageFormatException ex)
        {
            throw new ArgumentException("Imagem inválida ou corrompida.", ex);
        }
        catch (Exception ex) when (ex is ArgumentException)
        {
            throw;
        }
        catch (Exception ex)
        {
            // rethrow as generic argument exception to be handled as BadRequest in controller
            throw new ArgumentException("Falha ao processar a imagem.", ex);
        }
    }

    private static ClassificacaoCelula ClassifyCell(int r, int g, int b)
    {
        double brightness = (r + g + b) / 3.0;

        if (brightness > 230) return ClassificacaoCelula.NuvemOuAreaIndefinida;
        if (brightness < 40 && g < 60 && r < 80 && b < 80) return ClassificacaoCelula.PossivelQueimada;
        if (r > 100 && g > 60 && r - g > 10 && b < 120 && g < 150 && r > b)
        {
            if (r - g > 15 || (r > 120 && g > 80 && b < 100))
                return ClassificacaoCelula.SoloExposto;
        }
        if (g > r && g > b && g > 80)
        {
            if (g > 150 && r < 100 && b < 120) return ClassificacaoCelula.VegetacaoSaudavel;
            return ClassificacaoCelula.VegetacaoModerada;
        }
        if (Math.Abs(r - g) < 10 && Math.Abs(r - b) < 10 && brightness < 80) return ClassificacaoCelula.PossivelQueimada;
        if (g >= 70) return ClassificacaoCelula.VegetacaoModerada;
        return ClassificacaoCelula.NuvemOuAreaIndefinida;
    }

    private static string CalculateRisk(ResultadoAnaliseImagemDto result)
    {
        int total = result.TotalCelulas == 0 ? 1 : result.TotalCelulas;
        double pctQueimada = result.PossivelQueimada * 100.0 / total;
        double pctSolo = result.SoloExposto * 100.0 / total;
        double pctModeradaPlusSolo = (result.VegetacaoModerada + result.SoloExposto) * 100.0 / total;

        if (pctQueimada >= 20.0 || pctSolo >= 40.0) return NivelRisco.Critico.ToString();
        if (pctQueimada >= 10.0 || pctSolo >= 25.0) return NivelRisco.Alto.ToString();
        if (pctModeradaPlusSolo >= 30.0) return NivelRisco.Medio.ToString();
        return NivelRisco.Baixo.ToString();
    }

    private static string BuildResumo(ResultadoAnaliseImagemDto r)
    {
        var parts = new List<string>();
        if (r.VegetacaoSaudavel > r.TotalCelulas / 2)
        {
            parts.Add("A área apresenta maioria de vegetação saudável");
        }
        if (r.SoloExposto > 0)
        {
            parts.Add($"há sinais de solo exposto ({r.SoloExposto} células)");
        }
        if (r.PossivelQueimada > 0)
        {
            parts.Add($"possíveis focos de queimada ({r.PossivelQueimada} células)");
        }
        if (r.AreaIndefinida > 0)
        {
            parts.Add($"algumas áreas indefinidas/nuvens ({r.AreaIndefinida} células)");
        }
        if (parts.Count == 0) return "Sem informações relevantes detectadas.";
        return string.Join(", ", parts) + ".";
    }
}



