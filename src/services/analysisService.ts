import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse, getJson, postJson } from './apiClient';

export type AnaliseAmbientalDto = {
  id: number;
  regiaoMonitoradaId: number;
  fonteSatelitalId?: number | null;
  dataCaptura?: string | null;
  dataAnalise?: string | null;
  ndviMedio: number;
  percentualVegetacao: number;
  percentualSoloExposto: number;
  percentualAreaQueimada: number;
  classificacao: string;
  nivelRisco: 'Baixo' | 'Medio' | 'Alto' | 'Critico' | string;
  resumo?: string | null;
};

const STORAGE_KEY = 'nexusverde_analises_v1';
const LAST_ID_KEY = 'nexusverde_analises_last_id';

const DEFAULT_ANALISES: AnaliseAmbientalDto[] = [];

async function loadLocalAnalises(): Promise<AnaliseAmbientalDto[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      await AsyncStorage.setItem(LAST_ID_KEY, '0');
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ANALISES));
      return DEFAULT_ANALISES;
    }
    const parsed = JSON.parse(raw) as AnaliseAmbientalDto[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load analyses from AsyncStorage', e);
    return DEFAULT_ANALISES;
  }
}

async function saveLocalAnalises(items: AnaliseAmbientalDto[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save analyses to AsyncStorage', e);
    throw e;
  }
}

function nivelRiscoFromScores(ndvi: number, percSolo: number, percQueimada: number) {
  // simple heuristic
  if (percQueimada >= 25 || percSolo >= 40 || ndvi < -0.1) return 'Critico';
  if (percQueimada >= 10 || percSolo >= 25 || ndvi < 0.1) return 'Alto';
  if (percQueimada >= 3 || percSolo >= 10 || ndvi < 0.2) return 'Medio';
  return 'Baixo';
}

function classificacaoFromScores(ndvi: number, percSolo: number, percQueimada: number) {
  if (percQueimada >= 10) return 'PossivelQueimada';
  if (percSolo >= 25) return 'PossivelDesmatamento';
  if (ndvi >= 0.4) return 'VegetacaoDensa';
  return 'Monitoramento';
}

function makeResumo(a: AnaliseAmbientalDto) {
  return `NDVI médio ${a.ndviMedio.toFixed(2)}, vegetação ${a.percentualVegetacao.toFixed(1)}%, solo exposto ${a.percentualSoloExposto.toFixed(1)}%, área queimada ${a.percentualAreaQueimada.toFixed(1)}%`;
}

function makeSimulated(regiaoMonitoradaId: number, fonteSatelitalId?: number | null, dataCaptura?: string | null): AnaliseAmbientalDto {
  const ndvi = Number((Math.random() * 0.9 - 0.2).toFixed(3));
  const percVeget = Math.max(0, Math.min(100, Number((50 + (ndvi * 50) + (Math.random() * 20 - 10)).toFixed(2))));
  const percSolo = Math.max(0, Math.min(100, Number((100 - percVeget + (Math.random() * 10 - 5)).toFixed(2))));
  const percQueimada = Math.max(0, Math.min(100, Number((Math.random() * 15).toFixed(2))));

  const classificacao = classificacaoFromScores(ndvi, percSolo, percQueimada);
  const nivelRisco = nivelRiscoFromScores(ndvi, percSolo, percQueimada);

  return {
    id: Math.floor(Math.random() * 1_000_000),
    regiaoMonitoradaId,
    fonteSatelitalId: fonteSatelitalId ?? null,
    dataCaptura: dataCaptura ?? new Date().toISOString(),
    dataAnalise: new Date().toISOString(),
    ndviMedio: ndvi,
    percentualVegetacao: percVeget,
    percentualSoloExposto: percSolo,
    percentualAreaQueimada: percQueimada,
    classificacao,
    nivelRisco,
    resumo: '',
  };
}

export async function getAnalises(): Promise<ApiResponse<AnaliseAmbientalDto[]>> {
  try {
    const res = await getJson<AnaliseAmbientalDto[]>('AnalisesAmbientais');
    if (res.success && res.data) return { success: true, data: res.data };
  } catch {
    // ignore and fallback
  }

  try {
    const local = await loadLocalAnalises();
    return { success: true, data: local };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Falha ao carregar análises.' };
  }
}

export async function simulateAnalysis(body: { regiaoMonitoradaId: number; fonteSatelitalId?: number | null; dataCaptura?: string | null }): Promise<ApiResponse<AnaliseAmbientalDto>> {
  try {
    const res = await postJson<AnaliseAmbientalDto>('AnalisesAmbientais/simular', body);
    if (res.success && res.data) return { success: true, data: res.data };
  } catch {
    // fallback
  }

  try {
    // create simulated analysis and persist locally
    const local = await loadLocalAnalises();
    const lastRaw = await AsyncStorage.getItem(LAST_ID_KEY);
    const last = lastRaw ? Number(lastRaw) : (local.length ? Math.max(...local.map((r) => r.id)) : 0);
    const id = last + 1;
    const sim = makeSimulated(body.regiaoMonitoradaId, body.fonteSatelitalId, body.dataCaptura ?? new Date().toISOString());
    sim.id = id;
    sim.resumo = makeResumo(sim);
    local.push(sim);
    await saveLocalAnalises(local);
    await AsyncStorage.setItem(LAST_ID_KEY, String(id));
    return { success: true, data: sim };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Falha ao simular análise.' };
  }
}


