# GS-Mobile-1S (NexusVerde Mobile)

Aplicativo móvel desenvolvido em Expo / React Native para demonstrar funcionalidades de monitoramento ambiental, CRUD de regiões e alertas e simulação de análises ambientais. A aplicação foi implementada com estratégia "API-first" e fallback local via `AsyncStorage` para funcionar standalone quando a API não estiver disponível.

## Tecnologias

- Expo / React Native
- TypeScript
- expo-router (file-based routing)
- @react-native-async-storage/async-storage (persistência local)
- fetch (HTTP via `src/services/apiClient.ts`)
- Backend esperado: .NET WebAPI (projeto `NexusVerde WebAPI` no repositório)
# Nexus Verde — GS Mobile

Aplicativo móvel da Global Solution (projeto Nexus Verde) para monitoramento ambiental, com gestão de Regiões Monitoradas, Alertas Ambientais e simulação de Análises Ambientais.

## Descrição da solução

O app permite que usuários visualizem e gerenciem regiões monitoradas, registrem alertas ambientais (criação, edição, resolução e exclusão) e executem simulações de análises baseadas em imagens de satélite. A aplicação prioriza comunicação com a API REST do backend; quando a API não estiver disponível, há um fallback local via `AsyncStorage` para manter funcionalidades básicas offline.

## Tema

Global Solution — Plataforma de monitoramento ambiental para detecção e gestão de eventos como queimadas e desmatamento.

## Tecnologias

- Expo / React Native
- TypeScript
- expo-router (file-based routing)
- `@react-native-async-storage/async-storage` (fallback local)
- `fetch` (HTTP via `src/services/apiClient.ts`)
- ESLint (configurado via `expo lint`)

## Estrutura de pastas (resumo)

Principais diretórios e arquivos no repositório:

- `assets/` — imagens e ícones do app
- `NexusVerde-Fiap/` — projeto backend .NET e coleções relacionadas
- `src/` — código fonte do app (screens, components, services, hooks)
- `src/app/` — rotas base (expo-router)
- `src/components/` — componentes reutilizáveis
- `src/services/` — comunicação com API e lógica de persistência
- `src/screens/` — telas do app
- `package.json`, `app.json`, `tsconfig.json` — configuração do projeto

## Instalar dependências

```bash
npm install
```

## Rodar o app

- Iniciar o dev server (Expo):

```bash
npm start
```

- Abrir em emulador Android / iOS ou em um dispositivo com Expo Go.
- Comandos alternativos (scripts em `package.json`): `npm run android`, `npm run ios`, `npm run web`.

## Configurar `API_BASE_URL`

A URL base da API é resolvida em `src/services/config.ts`. Prioridades: variável de ambiente `EXPO_PUBLIC_API_URL`, campo `expo.extra` em `app.json` (`EXPO_PUBLIC_API_URL` ou `apiUrl`), então fallback `http://localhost:5170`.

Exemplos de uso (PowerShell):

```powershell
$env:EXPO_PUBLIC_API_URL = "http://192.168.1.100:5170"
npm start
```

Ou edite `app.json` adicionando em `expo.extra`:

```json
{
   "expo": {
      "extra": {
         "EXPO_PUBLIC_API_URL": "http://192.168.1.100:5170"
      }
   }
}
```

> Observação: para uso em dispositivo físico, use o IP da máquina que roda a API.

## Requisitos da API

O backend deve estar executando para que as operações principais (CRUD de Regiões, Alertas e Análises) funcionem sem fallback. A aplicação tentará usar a API como fonte primária — AsyncStorage é apenas fallback local.

### Endpoints consumidos

- Regiões monitoradas
   - GET `/api/RegioesMonitoradas` — listar regiões
   - GET `/api/RegioesMonitoradas/{id}` — obter região por id
   - POST `/api/RegioesMonitoradas` — criar região
   - PUT `/api/RegioesMonitoradas/{id}` — atualizar região
   - DELETE `/api/RegioesMonitoradas/{id}` — excluir região

- Alertas ambientais
   - GET `/api/AlertasAmbientais`
   - GET `/api/AlertasAmbientais/pendentes`
   - GET `/api/AlertasAmbientais/{id}`
   - POST `/api/AlertasAmbientais`
   - PUT `/api/AlertasAmbientais/{id}`
   - PUT `/api/AlertasAmbientais/{id}/resolver`
   - DELETE `/api/AlertasAmbientais/{id}`

- Fontes satelitais
   - GET `/api/FontesSatelitais`
   - POST `/api/FontesSatelitais`

- Análises ambientais
   - POST `/api/AnalisesAmbientais/simular`
   - GET `/api/AnalisesAmbientais`

## Regras aplicadas

- O `regionService` foi atualizado para usar a API como fonte principal. O fallback para `AsyncStorage` permanece apenas quando a API não responder.
- Tratamento de erros e loaders existem nas telas e em `src/services/apiClient.ts`.

## Equipe (RM)

- Mathaus Victor Souza Marcelino — RM: 564146
- Luan Peixoto Marins Rocha — RM: 562258
- Carlos Alberto Guedes Neto — RM: 566022
- Filippo Tolone — RM: 562329
- Eduardo Novaes Mollo — RM: 561515

## Vídeo demonstrativo

- Link: https://youtu.be/e2UM6kDNWJ0

## Observações finais

- Para desenvolvimento local: assegure que a API esteja rodando e acessível na rede.
- Execute `npx tsc --noEmit` e `npx eslint . --ext .ts,.tsx` para validar TypeScript e lint.

Se quiser, eu posso automaticamente commitar as mudanças e abrir um branch com as alterações feitas.
- Análises ambientais
