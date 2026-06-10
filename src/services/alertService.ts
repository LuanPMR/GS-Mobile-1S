import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse, deleteJson, getJson, postJson, putJson } from './apiClient';

const SIMULATED_IDS_KEY = 'nexusverde_simulated_alerts_v1';

// Backend DTO shape (partial)
export type AlertaAmbientalDto = {
  id: number;
  regiaoMonitoradaId: number;
  analiseAmbientalId?: number | null;
  tipoAlerta: string | number;
  nivelRisco: string | number;
  mensagem?: string;
  resolvido: boolean;
  dataCriacao: string;
  dataResolucao?: string | null;
  isTest?: boolean;
};

// App-friendly occurrence model (keeps compatibility with older UI code)
export type Occurrence = {
  id: string | number;
  regionName: string;
  satelliteCode?: string;
  status: 'PRESERVADA' | 'DESMATAMENTO' | 'QUEIMADA' | 'RISCO' | string;
  vegetationColor?: 'VERDE' | 'MARROM' | 'PRETO' | string;
  description?: string;
  detectedAt?: string;
};

// NOTE: no module-level SAMPLE_FALLBACK is required here — consumers provide their own UI fallbacks.

function mapDtoToOccurrence(dto: any): Occurrence {
  // dto may use PascalCase or camelCase depending on backend JSON serializer.
  const id = dto.id ?? dto.Id;
  const regiaoId = dto.regiaoMonitoradaId ?? dto.RegiaoMonitoradaId;
  const tipo = dto.tipoAlerta ?? dto.TipoAlerta ?? '';
  const nivel = dto.nivelRisco ?? dto.NivelRisco ?? '';
  const mensagem = dto.mensagem ?? dto.Mensagem ?? undefined;
  const dataCriacao = dto.dataCriacao ?? dto.DataCriacao;

  // Map backend alert types to app status
  const tipoStr = String(tipo).toLowerCase();
  const nivelStr = String(nivel).toLowerCase();

  let status: Occurrence['status'] = 'RISCO';
  if (tipoStr.includes('queim')) status = 'QUEIMADA';
  else if (tipoStr.includes('desmat')) status = 'DESMATAMENTO';
  else if (nivelStr.includes('alto') || nivelStr.includes('crit')) status = 'RISCO';
  else status = 'PRESERVADA';

  const vegetationColor: Occurrence['vegetationColor'] = status === 'QUEIMADA' ? 'PRETO' : status === 'DESMATAMENTO' ? 'MARROM' : 'VERDE';

  return {
    id,
    regionName: `Região ${regiaoId}`,
    satelliteCode: `MS-${String(dto.analiseAmbientalId ?? dto.AnaliseAmbientalId ?? '00')}`,
    status,
    vegetationColor,
    description: mensagem ?? undefined,
    detectedAt: dataCriacao ?? undefined,
  };
}

// Local storage keys for alerts (fallback when backend not available)
const STORAGE_KEY = 'nexusverde_alerts_v1';
const LAST_ID_KEY = 'nexusverde_alerts_last_id';

const DEFAULT_ALERTS: AlertaAmbientalDto[] = [];

async function loadLocalAlerts(): Promise<AlertaAmbientalDto[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      await AsyncStorage.setItem(LAST_ID_KEY, '0');
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ALERTS));
      return DEFAULT_ALERTS;
    }
    const parsed = JSON.parse(raw) as AlertaAmbientalDto[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load alerts from AsyncStorage', e);
    return DEFAULT_ALERTS;
  }
}

async function saveLocalAlerts(items: AlertaAmbientalDto[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save alerts to AsyncStorage', e);
    throw e;
  }
}


export async function getAlerts(): Promise<ApiResponse<AlertaAmbientalDto[] | Occurrence[]>> {
  try {
    const res = await getJson<AlertaAmbientalDto[]>('AlertasAmbientais');
    if (res.success && res.data) return { success: true, data: res.data.map(mapDtoToOccurrence) } as ApiResponse<any>;
  } catch {
    // ignore and fallback to local
  }

  // Fallback to local storage
  try {
    const local = await loadLocalAlerts();
    return { success: true, data: local.map(mapDtoToOccurrence) } as ApiResponse<any>;
  } catch (e: any) {
    return { success: false, error: e?.message || 'Falha ao carregar alertas.' };
  }
}

// Raw DTO access when UI needs original fields
export async function getAlertsRaw(): Promise<ApiResponse<AlertaAmbientalDto[]>> {
  try {
    const res = await getJson<AlertaAmbientalDto[]>('AlertasAmbientais');
    if (res.success && res.data) {
      // annotate server-returned DTOs with local simulated flags
      try {
        const raw = await AsyncStorage.getItem(SIMULATED_IDS_KEY);
        const ids: string[] = raw ? JSON.parse(raw) : [];
        if (Array.isArray(ids) && ids.length) {
          res.data.forEach((d: any) => {
            const idStr = String(d.id ?? d.Id ?? '');
            if (ids.includes(idStr)) d.isTest = true;
          });
        }
      } catch {
        // ignore storage errors
      }
      return res;
    }
  } catch {
    // ignore
  }

  try {
    const local = await loadLocalAlerts();
    return { success: true, data: local } as ApiResponse<any>;
  } catch (e: any) {
    return { success: false, error: e?.message || 'Falha ao carregar alertas.' };
  }
}

export async function getAlertById(id: number | string): Promise<ApiResponse<Occurrence>> {
  try {
    const res = await getJson<AlertaAmbientalDto>(`AlertasAmbientais/${id}`);
    if (res.success && res.data) return { success: true, data: mapDtoToOccurrence(res.data) } as ApiResponse<any>;
  } catch {
    // fallback
  }

  try {
    const local = await loadLocalAlerts();
    const n = Number(id);
    const found = local.find((a) => a.id === n || String(a.id) === String(id));
    if (!found) return { success: false, status: 404, error: 'Alerta não encontrado.' };
    return { success: true, data: mapDtoToOccurrence(found) } as ApiResponse<any>;
  } catch (e: any) {
    return { success: false, error: e?.message || 'Falha ao carregar alerta.' };
  }
}

export async function getAlertByIdRaw(id: number | string): Promise<ApiResponse<AlertaAmbientalDto>> {
  try {
    const res = await getJson<AlertaAmbientalDto>(`AlertasAmbientais/${id}`);
    if (res.success && res.data) return res;
  } catch {
    // ignore
  }

  try {
    const local = await loadLocalAlerts();
    const n = Number(id);
    const found = local.find((a) => a.id === n || String(a.id) === String(id));
    if (!found) return { success: false, status: 404, error: 'Alerta não encontrado.' };
    return { success: true, data: found } as ApiResponse<any>;
  } catch (e: any) {
    return { success: false, error: e?.message || 'Falha ao carregar alerta.' };
  }
}

export async function getPendentes(): Promise<ApiResponse<Occurrence[]>> {
  try {
    const res = await getJson<AlertaAmbientalDto[]>('AlertasAmbientais/pendentes');
    if (res.success && res.data) return { success: true, data: res.data.map(mapDtoToOccurrence) } as ApiResponse<any>;
  } catch {
    // ignore fallback to local
  }

  try {
    const local = await loadLocalAlerts();
    const pendentes = local.filter((a) => !a.resolvido).map(mapDtoToOccurrence);
    return { success: true, data: pendentes } as ApiResponse<any>;
  } catch (e: any) {
    return { success: false, error: e?.message || 'Falha ao carregar alertas pendentes.' };
  }
}

export async function createAlert(payload: any): Promise<ApiResponse<Occurrence>> {
  try {
    const res = await postJson<AlertaAmbientalDto>('AlertasAmbientais', payload);
    if (res.success && res.data) return { success: true, data: mapDtoToOccurrence(res.data) } as ApiResponse<any>;
  } catch {
    // fallback to local
  }

  try {
    const local = await loadLocalAlerts();
    const lastRaw = await AsyncStorage.getItem(LAST_ID_KEY);
    const last = lastRaw ? Number(lastRaw) : (local.length ? Math.max(...local.map((r) => r.id)) : 0);
    const id = last + 1;
    const now = new Date().toISOString();

    const dto: AlertaAmbientalDto = {
      id,
      regiaoMonitoradaId: Number(payload.regiaoMonitoradaId ?? payload.RegiaoMonitoradaId ?? payload.regionId ?? 0),
      analiseAmbientalId: payload.analiseAmbientalId != null ? Number(payload.analiseAmbientalId) : payload.AnaliseAmbientalId ?? null,
      tipoAlerta: payload.tipoAlerta ?? payload.TipoAlerta ?? 'Monitoramento',
      nivelRisco: payload.nivelRisco ?? payload.NivelRisco ?? 'Baixo',
      mensagem: payload.mensagem ?? payload.Mensagem ?? payload.description ?? null,
      resolvido: !!payload.resolvido,
      dataCriacao: now,
      dataResolucao: null,
    };

    // Preserve test flag in local DTO so UI can mark simulated alerts
    (dto as any).isTest = !!payload.isTest || !!payload.__simulado;

    local.push(dto);
    await saveLocalAlerts(local);
    await AsyncStorage.setItem(LAST_ID_KEY, String(id));

    return { success: true, data: mapDtoToOccurrence(dto) } as ApiResponse<any>;
  } catch (e: any) {
    return { success: false, error: e?.message || 'Falha ao criar alerta.' };
  }
}

/**
 * Gera um alerta de teste (aleatório) para demonstração.
 * Tenta criar via `createAlert` (usa API se disponível, senão salva localmente).
 */
export async function generateTestAlert(): Promise<ApiResponse<Occurrence>> {
  try {
    const TIPOS = ['PossivelQueimada', 'PossivelDesmatamento', 'AreaCritica'];
    const NIVEIS = ['Baixo', 'Medio', 'Alto', 'Critico'];
    const MENSAGENS = [
      'Possível foco de calor identificado.',
      'Alteração brusca da vegetação detectada.',
      'Área com indícios de desmatamento.',
      'Anomalia ambiental identificada pela IA.',
    ];
    const REGIOES = [
      { name: 'Amazônia', id: 1 },
      { name: 'Cerrado', id: 2 },
      { name: 'Pantanal', id: 3 },
      { name: 'Mata Atlântica', id: 4 },
    ];

    const rand = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

    const payload = {
      regiaoMonitoradaId: rand(REGIOES).id,
      tipoAlerta: rand(TIPOS),
      nivelRisco: rand(NIVEIS),
      mensagem: rand(MENSAGENS),
      resolvido: false,
      // marca no payload para o client saber que foi gerado por teste (não altera lógica do backend)
      __simulado: true,
    } as any;

    // ensure server/local fallback knows this is a test alert
    payload.isTest = true;
    const res = await createAlert(payload);
    // Persist created ID so later fetches can be annotated as simulated
    if (res.success && res.data) {
      try {
        const idStr = String((res.data as any).id ?? '');
        const raw = await AsyncStorage.getItem(SIMULATED_IDS_KEY);
        const ids: string[] = raw ? JSON.parse(raw) : [];
        if (!ids.includes(idStr)) {
          ids.push(idStr);
          await AsyncStorage.setItem(SIMULATED_IDS_KEY, JSON.stringify(ids));
        }
      } catch {
        // ignore storage errors
      }

      return { success: true, data: { ...(res.data as any), __simulado: true } as any };
    }
    return res;
  } catch (e: any) {
    console.error('[alertService] generateTestAlert error', e);
    return { success: false, error: e?.message || 'Falha ao gerar alerta de teste.' };
  }
}

export async function updateAlert(id: number | string, payload: any): Promise<ApiResponse<Occurrence>> {
  try {
    const res = await putJson<AlertaAmbientalDto>(`AlertasAmbientais/${id}`, payload);
    if (res.success && res.data) return { success: true, data: mapDtoToOccurrence(res.data) } as ApiResponse<any>;
  } catch {
    // fallback
  }

  try {
    const local = await loadLocalAlerts();
    const n = Number(id);
    const idx = local.findIndex((a) => a.id === n || String(a.id) === String(id));
    if (idx === -1) return { success: false, status: 404, error: 'Alerta não encontrado.' };

    const current = local[idx];
    const updated: AlertaAmbientalDto = {
      ...current,
      tipoAlerta: payload.tipoAlerta ?? payload.TipoAlerta ?? current.tipoAlerta,
      nivelRisco: payload.nivelRisco ?? payload.NivelRisco ?? current.nivelRisco,
      mensagem: payload.mensagem ?? payload.Mensagem ?? current.mensagem,
      resolvido: payload.resolvido != null ? Boolean(payload.resolvido) : current.resolvido,
      dataResolucao: payload.resolvido ? current.dataResolucao ?? new Date().toISOString() : current.dataResolucao,
    };

    local[idx] = updated;
    await saveLocalAlerts(local);
    return { success: true, data: mapDtoToOccurrence(updated) } as ApiResponse<any>;
  } catch (e: any) {
    return { success: false, error: e?.message || 'Falha ao atualizar alerta.' };
  }
}

export async function resolveAlert(id: number | string): Promise<ApiResponse<Occurrence>> {
  try {
    const res = await putJson<AlertaAmbientalDto>(`AlertasAmbientais/${id}/resolver`, null);
    if (res.success && res.data) return { success: true, data: mapDtoToOccurrence(res.data) } as ApiResponse<any>;
  } catch {
    // fallback
  }

  try {
    const local = await loadLocalAlerts();
    const n = Number(id);
    const idx = local.findIndex((a) => a.id === n || String(a.id) === String(id));
    if (idx === -1) return { success: false, status: 404, error: 'Alerta não encontrado.' };
    local[idx].resolvido = true;
    local[idx].dataResolucao = new Date().toISOString();
    await saveLocalAlerts(local);
    return { success: true, data: mapDtoToOccurrence(local[idx]) } as ApiResponse<any>;
  } catch (e: any) {
    return { success: false, error: e?.message || 'Falha ao resolver alerta.' };
  }
}

export async function deleteAlert(id: number | string): Promise<ApiResponse<null>> {
  try {
    const res = await deleteJson<null>(`AlertasAmbientais/${id}`);
    if (res.success) return { success: true, data: null };
  } catch {
    // ignore
  }

  try {
    const local = await loadLocalAlerts();
    const n = Number(id);
    const idx = local.findIndex((a) => a.id === n || String(a.id) === String(id));
    if (idx === -1) return { success: false, status: 404, error: 'Alerta não encontrado.' };
    local.splice(idx, 1);
    await saveLocalAlerts(local);
    return { success: true, data: null };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Falha ao excluir alerta.' };
  }
}
