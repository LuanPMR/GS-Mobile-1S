#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Script de teste para o endpoint de análise ambiental

.DESCRIPTION
    Testa o endpoint POST /api/AnalisesAmbientais/analisar-imagem
    com diferentes imagens e configurações

.EXAMPLE
    .\test-image-analysis.ps1

.NOTES
    Requer: PowerShell 5.0+, curl.exe disponível
#>

param(
    [string]$ApiUrl = "http://localhost:5170",
    [string]$ImagePath = "$env:TEMP\test_image.png"
)

# Criar imagem de teste se não existir
if (-not (Test-Path $ImagePath)) {
    Write-Host "Criando imagem de teste..." -ForegroundColor Cyan
    $pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=="
    $imageBytes = [Convert]::FromBase64String($pngBase64)
    [IO.File]::WriteAllBytes($ImagePath, $imageBytes)
    Write-Host "✓ Imagem de teste criada: $ImagePath" -ForegroundColor Green
}

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Yellow
Write-Host "TESTE DO ENDPOINT DE ANÁLISE AMBIENTAL" -ForegroundColor Yellow
Write-Host "=" * 60 -ForegroundColor Yellow

# Teste 1: Verificar se a API está rodando
Write-Host ""
Write-Host "1️⃣  Verificando se API está rodando..." -ForegroundColor Cyan
try {
    $healthCheck = Invoke-WebRequest -Uri "$ApiUrl/swagger/v1/swagger.json" -UseBasicParsing -ErrorAction Stop
    Write-Host "✓ API respondendo (Status: $($healthCheck.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "✗ API não está respondendo!" -ForegroundColor Red
    Write-Host "  Certifique-se de que a API está rodando em: $ApiUrl" -ForegroundColor Yellow
    exit 1
}

# Teste 2: Análise padrão (10x10)
Write-Host ""
Write-Host "2️⃣  Testando análise com grade 10x10 (padrão)..." -ForegroundColor Cyan
$response = & "C:\Windows\System32\curl.exe" -X POST `
    -F "imagem=@$ImagePath" `
    "$ApiUrl/api/AnalisesAmbientais/analisar-imagem" -s

try {
    $json = $response | ConvertFrom-Json
    Write-Host "✓ Análise realizada com sucesso!" -ForegroundColor Green
    Write-Host "  Total de células: $($json.totalCelulas)"
    Write-Host "  Vegetação Saudável: $($json.vegetacaoSaudavel) ($($json.percentualVegetacaoSaudavel)%)"
    Write-Host "  Vegetação Moderada: $($json.vegetacaoModerada) ($($json.percentualVegetacaoModerada)%)"
    Write-Host "  Solo Exposto: $($json.soloExposto) ($($json.percentualSoloExposto)%)"
    Write-Host "  Possível Queimada: $($json.possivelQueimada) ($($json.percentualPossivelQueimada)%)"
    Write-Host "  Área Indefinida: $($json.areaIndefinida) ($($json.percentualAreaIndefinida)%)"
    Write-Host "  Nível de Risco: $($json.nivelRisco)"
    Write-Host "  Resumo: $($json.resumo)"
} catch {
    Write-Host "✗ Erro ao processar resposta" -ForegroundColor Red
    Write-Host "  Resposta: $response" -ForegroundColor Yellow
}

# Teste 3: Análise com grade 2x2
Write-Host ""
Write-Host "3️⃣  Testando análise com grade 2x2..." -ForegroundColor Cyan
$response = & "C:\Windows\System32\curl.exe" -X POST `
    -F "imagem=@$ImagePath" `
    -F "linhas=2" `
    -F "colunas=2" `
    "$ApiUrl/api/AnalisesAmbientais/analisar-imagem" -s

try {
    $json = $response | ConvertFrom-Json
    Write-Host "✓ Análise realizada com sucesso!" -ForegroundColor Green
    Write-Host "  Total de células: $($json.totalCelulas)"
    Write-Host "  Nível de Risco: $($json.nivelRisco)"
} catch {
    Write-Host "✗ Erro ao processar resposta" -ForegroundColor Red
}

# Teste 4: Análise com grade 5x5
Write-Host ""
Write-Host "4️⃣  Testando análise com grade 5x5..." -ForegroundColor Cyan
$response = & "C:\Windows\System32\curl.exe" -X POST `
    -F "imagem=@$ImagePath" `
    -F "linhas=5" `
    -F "colunas=5" `
    "$ApiUrl/api/AnalisesAmbientais/analisar-imagem" -s

try {
    $json = $response | ConvertFrom-Json
    Write-Host "✓ Análise realizada com sucesso!" -ForegroundColor Green
    Write-Host "  Total de células: $($json.totalCelulas)"
    Write-Host "  Nível de Risco: $($json.nivelRisco)"
} catch {
    Write-Host "✗ Erro ao processar resposta" -ForegroundColor Red
}

# Teste 5: Teste de arquivo inválido
Write-Host ""
Write-Host "5️⃣  Testando com arquivo inválido (espera-se erro)..." -ForegroundColor Cyan
$invalidFile = "$env:TEMP\test_invalid.txt"
"Este não é uma imagem" | Out-File -FilePath $invalidFile -Encoding UTF8

$response = & "C:\Windows\System32\curl.exe" -X POST `
    -F "imagem=@$invalidFile" `
    "$ApiUrl/api/AnalisesAmbientais/analisar-imagem" -s

try {
    $json = $response | ConvertFrom-Json
    if ($json.erro) {
        Write-Host "✓ Erro capturado corretamente!" -ForegroundColor Green
        Write-Host "  Mensagem: $($json.erro)"
    } else {
        Write-Host "⚠ Esperava erro, mas funcionou (comportamento inesperado)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✓ Erro capturado corretamente!" -ForegroundColor Green
}

# Resumo
Write-Host ""
Write-Host "=" * 60 -ForegroundColor Yellow
Write-Host "TESTES CONCLUÍDOS" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Yellow
Write-Host ""
Write-Host "📊 Links úteis:" -ForegroundColor Cyan
Write-Host "  - Swagger UI: $ApiUrl/"
Write-Host "  - Swagger JSON: $ApiUrl/swagger/v1/swagger.json"
Write-Host "  - Endpoint: POST $ApiUrl/api/AnalisesAmbientais/analisar-imagem"
Write-Host ""
Write-Host "💡 Próximos passos:" -ForegroundColor Cyan
Write-Host "  1. Testar com suas próprias imagens"
Write-Host "  2. Experimente diferentes grades (linhas/colunas)"
Write-Host "  3. Integre com o banco de dados (Fase 2)"
Write-Host "  4. Adicione análises periódicas do Sentinel Hub (Fase 3)"
Write-Host ""

