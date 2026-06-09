# GS-Mobile-1S (NexusVerde Mobile)

Aplicativo móvel desenvolvido em Expo / React Native para demonstrar funcionalidades de monitoramento ambiental, CRUD de regiões e alertas e simulação de análises ambientais. A aplicação foi implementada com estratégia "API-first" e fallback local via `AsyncStorage` para funcionar standalone quando a API não estiver disponível.

## Tecnologias

- Expo / React Native
- TypeScript
- expo-router (file-based routing)
- @react-native-async-storage/async-storage (persistência local)
- fetch (HTTP via `src/services/apiClient.ts`)
- Backend esperado: .NET WebAPI (projeto `NexusVerde WebAPI` no repositório)

## Instalar dependências

```bash
npm install
```

## Rodar o app

- Iniciar o dev server (Expo):

```bash
npm start
```

- Abrir em emulador Android / iOS ou em um dispositivo com Expo Go (veja as opções exibidas pelo `expo`).
- Comandos alternativos (scripts definidos em `package.json`):

```bash
npm run android
npm run ios
npm run web
```

## Configurar `API_BASE_URL`

A URL base da API é definida em `src/services/config.ts` e por padrão é `http://localhost:5170`.

- Variável de ambiente pública (recomendada para dev): `EXPO_PUBLIC_API_URL`.

Exemplos para iniciar o servidor Expo apontando para a API (substitua o IP pelo da sua máquina quando necessário):

Windows (PowerShell):

```powershell
$env:EXPO_PUBLIC_API_URL = "http://192.168.1.100:5170"
npm start
```

Windows (cmd):

```cmd
set EXPO_PUBLIC_API_URL=http://192.168.1.100:5170&& npm start
```

macOS / Linux:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.100:5170 npm start
```

- Alternativa em tempo de execução (dentro do app):

```ts
import { setApiBaseUrl } from '@/services/api';
setApiBaseUrl('http://192.168.1.100:5170');
```

## Observações importantes sobre `localhost` e redes

- `localhost` pode funcionar automaticamente no iOS Simulator (ele resolve para a máquina host). No Android emulator clássico (AVD) o endereço da máquina host costuma ser `10.0.2.2` (ou `10.0.3.2` em alguns emuladores como Genymotion).
- Em um celular físico você deve usar o IP da sua máquina na mesma rede (ex.: `http://192.168.1.100:5170`).
- API padrão (quando estiver rodando localmente): `http://localhost:5170`
- Swagger provável (quando a API estiver no host local): `http://localhost:5170/swagger`

## Telas do app

- **Home**: Tela principal / dashboard.
- **Monitoramento**: Mostra satélites em fila, status e permite iniciar/parar simulação local.
- **Regiões**: Lista de regiões monitoradas; permite criar, editar e excluir regiões.
- **Novo / Editar Região**: Formulário para criar ou atualizar uma região (nome, bioma, localização, área, etc.).
- **Alertas**: Lista de alertas ambientais; permite criar, editar, resolver e excluir alertas.
- **Novo / Editar Alerta**: Formulário para criar ou atualizar alertas (região relacionada, tipo, nível de risco, mensagem).
- **Análises**: Permite selecionar região e fonte satelital, simular uma análise ambiental e listar análises existentes.
- **Explorar / Relatórios / Equipe**: Telas auxiliares (exploração, envio de relatórios e informações da equipe).

## Endpoints usados pelo app

O app foi desenhado para trabalhar com a API REST do backend `NexusVerde WebAPI`. Os endpoints principais que o app consome são:

- Regiões monitoradas
   - GET `/api/RegioesMonitoradas` — listar regiões
   - GET `/api/RegioesMonitoradas/{id}` — obter região por id
   - POST `/api/RegioesMonitoradas` — criar região
   - PUT `/api/RegioesMonitoradas/{id}` — atualizar região
   - DELETE `/api/RegioesMonitoradas/{id}` — excluir região

- Alertas ambientais
   - GET `/api/AlertasAmbientais` — listar alertas
   - GET `/api/AlertasAmbientais/pendentes` — listar alertas pendentes
   - GET `/api/AlertasAmbientais/{id}` — obter alerta por id
   - POST `/api/AlertasAmbientais` — criar alerta
   - PUT `/api/AlertasAmbientais/{id}` — atualizar alerta
   - PUT `/api/AlertasAmbientais/{id}/resolver` — marcar alerta como resolvido
   - DELETE `/api/AlertasAmbientais/{id}` — excluir alerta

- Fontes satelitais
   - GET `/api/FontesSatelitais` — listar fontes
   - POST `/api/FontesSatelitais` — criar fonte (quando aplicável)

- Análises ambientais
   - POST `/api/AnalisesAmbientais/simular` — simular análise
      - Body esperado (ex.): `{ "regiaoMonitoradaId": 1, "fonteSatelitalId": 2, "dataCaptura": "2026-06-09T12:00:00Z" }`
   - GET `/api/AnalisesAmbientais` — listar análises

Observação: a aplicação tenta usar os endpoints quando a API está disponível; quando não está, várias funcionalidades têm fallback local via `AsyncStorage` para manter o app funcional offline.

## CRUD de Regiões e Alertas

- Regiões:
   - Tela: **Regiões** e **Novo / Editar Região**.
   - Campos principais: `nome`, `bioma`, `estado`, `pais`, `latitude`, `longitude`, `areaKm2`, `ativa`.
   - Persistência local: chaves `nexusverde_regions_v1` e `nexusverde_regions_last_id` no `AsyncStorage`.
   - Observação: a implementação atual do serviço de regiões grava localmente (AsyncStorage) para garantir que o app funcione sem backend.

- Alertas:
   - Tela: **Alertas** e **Novo / Editar Alerta**.
   - Campos principais: `regiaoMonitoradaId`, `analiseAmbientalId` (opcional), `tipoAlerta`, `nivelRisco`, `mensagem`, `resolvido`.
   - Fluxos suportados: criar, editar, listar, excluir e resolver (marcar como resolvido).
   - Persistência e fallback: o `alertService` tenta chamar os endpoints do backend e, em caso de falha, persiste localmente em `AsyncStorage` usando as chaves `nexusverde_alerts_v1` e `nexusverde_alerts_last_id`.
   - O app mapeia o DTO do backend para um modelo de ocorrência (`Occurrence`) usado na UI.

## Simulação de análise ambiental

- Tela: **Análises**.
- O usuário seleciona uma região e uma fonte satelital e clica em **Simular análise**.
- Endpoint: `POST /api/AnalisesAmbientais/simular` com corpo contendo `regiaoMonitoradaId`, `fonteSatelitalId` e `dataCaptura`.
- Campos retornados que são exibidos na UI: `ndviMedio`, `percentualVegetacao`, `percentualSoloExposto`, `percentualAreaQueimada`, `classificacao`, `nivelRisco`, `resumo`, `dataAnalise`.
- Fallback local: quando a API não estiver disponível a aplicação gera uma simulação local (heurística simples) e persiste o resultado em `AsyncStorage` com as chaves `nexusverde_analises_v1` e `nexusverde_analises_last_id`.

## Integrantes / RMs

Preencha com os integrantes reais do grupo:

- Nome Sobrenome — RM 000000
- Nome Sobrenome — RM 000000
- Nome Sobrenome — RM 000000

## Link do vídeo

Insira aqui o link do vídeo demonstrativo (placeholder):

- LINK_DO_VIDEO_AQUI

## Como contribuir

- Faça um fork, crie uma branch feature/descrição e envie um pull request.
- Para alterações relacionadas à API, priorizar compatibilidade com a estrutura de DTOs em `NexusVerde.Application/DTOs`.

---

Se precisar, posso ajustar o README com os nomes reais dos integrantes e o link do vídeo. Deseja que eu adicione esses dados agora?
