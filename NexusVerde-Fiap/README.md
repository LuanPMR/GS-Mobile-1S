# Nexus Verde — Monitoramento Ambiental com Dados Satelitais

## 🌍 Visão Geral

**Nexus Verde** é uma API REST em ASP.NET Core desenvolvida para monitoramento de florestas e áreas ambientais usando dados de imagens satelitais públicas e análise ambiental baseada em regras de Inteligência Artificial. O sistema demonstra como tecnologias de economia espacial podem apoiar a preservação ambiental, o combate ao desmatamento e o monitoramento contínuo de ecossistemas.

## 🎯 Contexto do Problema

A deforestação global avança a taxas alarmantes, especialmente em regiões como a Amazônia. Ferramentas tradicionais de monitoramento são custosas, lentas e pouco acessíveis para organizações locais. Dados satelitais públicos (Sentinel-2, Landsat) oferecem uma oportunidade para democratizar o acesso a informações ambientais em tempo real.

## 💡 Proposta da Solução

Nexus Verde utiliza:

- **Imagens Satelitais Públicas**: Integração com Sentinel Hub (Copernicus) e NASA EOSDIS
- **Análise Espectral**: Cálculo de índices de vegetação (NDVI) para avaliar saúde florestal
- **IA Baseada em Regras**: Classificação automática de risco ambiental
- **Geolocalização**: Coordenadas GPS para rastreamento de áreas específicas
- **Histórico Ambiental**: Registro de mudanças ao longo do tempo
- **Análise de Imagens por Células**: Divisão de imagens em células, análise espectral por célula e geração automática de alertas

### Índice NDVI (Normalized Difference Vegetation Index)

```
NDVI = (NIR - RED) / (NIR + RED)

Interpretação:
- NDVI >= 0.60: Vegetação Saudável (Baixo Risco)
- 0.30 ≤ NDVI < 0.60: Vegetação Moderada (Risco Médio)
- 0.10 ≤ NDVI < 0.30: Vegetação Baixa (Risco Alto)
- NDVI < 0.10: Possível Desmatamento/Queimada (Risco Crítico)
```

## 🚀 Economia Espacial

O projeto se alinha com objetivos de economia espacial ao:

1. **Reutilizar Dados Públicos**: Usa dados gratuitos do Sentinel-2 (ESA) e Landsat (USGS)
2. **Reduzir Custos**: Evita satélites privados custosos
3. **Escalabilidade**: Arquitetura em camadas permite futuras integrações
4. **Inovação**: Demonstra viabilidade de soluções open-source para sustentabilidade

## 📋 Arquitetura

A API segue padrão **Clean Architecture** em 3 camadas:

```
NexusVerde.Domain/           ← Entidades e Lógica de Negócio
  ├── Entities/
  ├── Enums/
  ├── Commons/
  └── Repositories/

NexusVerde.Application/      ← Serviços e DTOs
  ├── Services/
  ├── Interfaces/
  ├── DTOs/
  └── Mapping/

NexusVerde.Infrastructure/   ← Persistência e Configuração
  ├── Data/
  ├── Configurations/
  ├── Migrations/
  └── Repositories/

NexusVerde WebAPI/           ← Controllers REST
  └── Controllers/
```

## 🏗️ Entidades Principais

### RegiaoMonitorada
Representa uma área geográfica sob monitoramento contínuo.

```json
{
  "id": 1,
  "nome": "Amazonia Norte - Estado de Roraima",
  "bioma": "Amazonia",
  "estado": "Roraima",
  "pais": "Brasil",
  "latitude": -2.5,
  "longitude": -60.5,
  "areaKm2": 15000.0,
  "ativa": true,
  "dataCadastro": "2024-03-04T10:00:00Z"
}
```

### FonteSatelital
Fonte de dados de observação terrestre (Sentinel-2, Landsat, etc.).

```json
{
  "id": 1,
  "nome": "Sentinel-2",
  "tipo": "SatelitePublico",
  "provedor": "Copernicus/ESA",
  "resolucaoMetros": 10,
  "frequenciaPassagemDias": 5,
  "ativa": true
}
```

### ImagemSatelital
Imagem satelital capturada de uma região em data específica.

```json
{
  "id": 1,
  "regiaoMonitoradaId": 1,
  "fonteSatelitalId": 1,
  "dataCaptura": "2024-03-04T10:00:00Z",
  "urlImagem": "https://...",
  "processada": true
}
```

### AnaliseAmbiental
Análise dos índices espectrais e classificação de risco de uma imagem.

```json
{
  "id": 1,
  "imagemSatelitalId": 1,
  "ndviMedio": 0.45,
  "ndviMinimo": 0.10,
  "ndviMaximo": 0.75,
  "percentualVegetacaoSaudavel": 45,
  "percentualVegetacaoModerada": 35,
  "percentualSoloExposto": 15,
  "percentualPossivelQueimada": 5,
  "nivelRisco": "Medio",
  "dataAnalise": "2024-03-04T11:00:00Z"
}
```

### AlertaAmbiental
Alerta automático gerado quando análise detecta risco Alto ou Crítico.

```json
{
  "id": 1,
  "regiaoMonitoradaId": 1,
  "nivelRisco": "Critico",
  "mensagem": "Possível desmatamento detectado",
  "dataCriacao": "2024-03-04T11:05:00Z",
  "resolvido": false
}
```

### HistoricoMonitoramento
Registro de variações NDVI e mudanças ao longo do tempo em uma região.

```json
{
  "id": 1,
  "regiaoMonitoradaId": 1,
  "dataMedicao": "2024-03-04T10:00:00Z",
  "ndviMedio": 0.48,
  "tendencia": "Estavel"
}
```

## 📊 Endpoints Principais

### Regiões Monitoradas
```
GET    /api/RegioesMonitoradas          - Listar todas as regiões
GET    /api/RegioesMonitoradas/{id}     - Obter região específica
POST   /api/RegioesMonitoradas          - Criar nova região
PUT    /api/RegioesMonitoradas/{id}     - Atualizar região
DELETE /api/RegioesMonitoradas/{id}     - Deletar região
```

### Fontes Satelitais
```
GET    /api/FontesSatelitais            - Listar todas as fontes
GET    /api/FontesSatelitais/{id}       - Obter fonte específica
POST   /api/FontesSatelitais            - Criar nova fonte
PUT    /api/FontesSatelitais/{id}       - Atualizar fonte
DELETE /api/FontesSatelitais/{id}       - Deletar fonte
```

### Imagens Satelitais
```
GET    /api/ImagensSatelitais           - Listar todas as imagens
GET    /api/ImagensSatelitais/{id}      - Obter imagem específica
POST   /api/ImagensSatelitais           - Adicionar nova imagem
DELETE /api/ImagensSatelitais/{id}      - Deletar imagem
```

### Análises Ambientais
```
GET    /api/AnalisesAmbientais                    - Listar todas as análises
GET    /api/AnalisesAmbientais/{id}               - Obter análise específica
POST   /api/AnalisesAmbientais                    - Criar análise
POST   /api/AnalisesAmbientais/analisar-imagem   - Upload e análise de imagem
GET    /api/AnalisesAmbientais/risco/{nivel}     - Filtrar por nível de risco
DELETE /api/AnalisesAmbientais/{id}              - Deletar análise
```

### Alertas Ambientais
```
GET    /api/AlertasAmbientais                    - Listar todos os alertas
GET    /api/AlertasAmbientais/{id}               - Obter alerta específico
GET    /api/AlertasAmbientais/risco/{nivel}     - Alertas por nível de risco
POST   /api/AlertasAmbientais/{id}/resolver      - Marcar alerta como resolvido
DELETE /api/AlertasAmbientais/{id}               - Deletar alerta
```

### Histórico de Monitoramento
```
GET    /api/HistoricoMonitoramento              - Listar todo o histórico
GET    /api/HistoricoMonitoramento/regiao/{id}  - Histórico de região específica
POST   /api/HistoricoMonitoramento              - Registrar medição
```

## 🔧 Pré-requisitos

Antes de executar:

- .NET SDK 10 ou superior
- Acesso ao banco de dados Oracle (ou SQL Server com alterações)
- dotnet-ef CLI: `dotnet tool install --global dotnet-ef`
- IDE recomendada: Rider, Visual Studio ou VS Code

## 🚀 Configuração Rápida

### 1. Restaurar dependências

```bash
dotnet restore
```

### 2. Configurar banco de dados

Editar `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=YOUR_ORACLE_HOST:1521/your_db;User Id=your_user;Password=your_password;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

### 3. Aplicar migrations

```bash
dotnet ef database update --project NexusVerde.Infrastructure --startup-project "NexusVerde WebAPI"
```

### 4. Build e execução

```bash
dotnet build
dotnet run --project "NexusVerde WebAPI"
```

A API estará disponível em: **http://localhost:5170**

Swagger em: **http://localhost:5170/swagger**

## 🧪 Testando a API

### Via Swagger UI

1. Acesse `http://localhost:5170/swagger`
2. Explore os endpoints interativamente
3. Clique em "Try it out" para testar

### Via cURL

```bash
# Obter todas as regiões
curl -X GET "http://localhost:5170/api/RegioesMonitoradas" \
  -H "accept: application/json"

# Criar região
curl -X POST "http://localhost:5170/api/RegioesMonitoradas" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Região de Teste",
    "bioma": "Amazonia",
    "estado": "AM",
    "pais": "Brasil",
    "latitude": -3.5,
    "longitude": -62.0,
    "areaKm2": 10000.0
  }'

# Upload e análise de imagem
curl -X POST "http://localhost:5170/api/AnalisesAmbientais/analisar-imagem" \
  -F "imagem=@/caminho/para/imagem.jpg" \
  -H "accept: application/json"

# Obter alertas críticos
curl -X GET "http://localhost:5170/api/AlertasAmbientais/risco/Critico" \
  -H "accept: application/json"
```

### Via Postman

Importar a coleção fornecida: `Veterinaria_API_Stable.postman_collection.json`

## 📖 Documentação API

Todos os endpoints estão documentados automaticamente no Swagger com:
- Descrições detalhadas
- Exemplos de request/response
- Códigos de status HTTP esperados
- Validações de entrada

## 🤖 Análise de Imagens por Células

Funcionalidade diferenciada: a API divide imagens em células (grid), analisa cada célula individualmente e:

1. Classifica o tipo de cobertura (vegetação, solo, água, etc.)
2. Calcula índices espectrais por célula
3. Gera alertas automáticos para células com risco Alto ou Crítico
4. Mantém histórico completo para rastreamento ambiental

## 🔗 Relacionamentos de Dados

```
RegiaoMonitorada (1) ──→ (N) FonteSatelital (via ImagemSatelital)
RegiaoMonitorada (1) ──→ (N) ImagemSatelital
RegiaoMonitorada (1) ──→ (N) AnaliseAmbiental
RegiaoMonitorada (1) ──→ (N) AlertaAmbiental
RegiaoMonitorada (1) ──→ (N) HistoricoMonitoramento
FonteSatelital (1) ──→ (N) ImagemSatelital
ImagemSatelital (1) ──→ (1) AnaliseAmbiental
```

## 📊 Dados Iniciais

O banco é populado automaticamente com:

- 5 regiões monitoradas (Amazônia, Cerrado, Mata Atlântica, Caatinga, Pantanal)
- 3 fontes satelitais (Sentinel-2, Landsat 8, Simulado)
- Exemplos de imagens, análises e alertas
- Histórico de variações de vegetação

## 🎓 Proposta de Valor Acadêmica

Este projeto demonstra:

1. **Arquitetura em Camadas**: Clean Architecture com separação clara
2. **Boas Práticas .NET**: Entity Framework Core, AutoMapper, Dependency Injection
3. **API RESTful**: HTTP verbs corretos, status codes apropriados, JSON
4. **Banco de Dados Relacional**: Oracle Database com Migrations
5. **Inovação Sustentável**: Uso de dados públicos para preservação ambiental
6. **IA Transparente**: Lógica de classificação baseada em regras auditáveis

## 📈 Roadmap Futuro

- [ ] Integração real com Sentinel Hub API
- [ ] Dashboard web com mapas interativos (React/Vue)
- [ ] App mobile (Xamarin/MAUI)
- [ ] Machine Learning real para classificação de imagens
- [ ] Notificações em tempo real (WebSockets)
- [ ] Exportação de relatórios (PDF)
- [ ] Integração com serviços de email/SMS
- [ ] Autenticação JWT
- [ ] Rate limiting e cache distribuído (Redis)

## 🤝 Contribuição

Este é um projeto acadêmico FIAP. Contribuições e sugestões são bem-vindas!

## 📄 Licença

MIT License - Livre para uso e modificação.

---

**Desenvolvido com ❤️ para preservação ambiental através da tecnologia e inovação espacial**

