import { ApiResponse, deleteJson, getJson, postJson, putJson } from './apiClient';

// Backend DTO shape (partial)
type AlertaAmbientalDto = {
  id: number;
  regiaoMonitoradaId: number;
  analiseAmbientalId?: number | null;
  tipoAlerta: string | number;
  nivelRisco: string | number;
  mensagem?: string;
  resolvido: boolean;
  dataCriacao: string;
  dataResolucao?: string | null;
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

const SAMPLE_FALLBACK: Occurrence[] = [
  {
    id: 'f1',
    regionName: 'Amazônia',
    satelliteCode: 'MS-01',
    status: 'QUEIMADA',
    vegetationColor: 'PRETO',
    description: 'Fumaça detectada por algoritmo de IA (fallback).',
    detectedAt: new Date().toISOString(),
  },
];

function mapDtoToOccurrence(dto: any): Occurrence {
  // dto may use PascalCase or camelCase depending on backend JSON serializer.
  const id = dto.id ?? dto.Id;
  const regiaoId = dto.regiaoMonitoradaId ?? dto.RegiaoMonitoradaId;
  const tipo = (dto.tipoAlerta ?? dto.TipoAlerta) as any;
  const nivel = (dto.nivelRisco ?? dto.NivelRisco) as any;
  const mensagem = dto.mensagem ?? dto.Mensagem ?? dto.mensagem ?? dto.Mensagem;
  const dataCriacao = dto.dataCriacao ?? dto.DataCriacao;

  // Map backend alert types to app status
  let status: Occurrence['status'] = 'RISCO';
  if (String(tipo).toLowerCase().includes('queim') || String(tipo).toLowerCase().includes('Queimada')) status = 'QUEIMADA';
  else if (String(tipo).toLowerCase().includes('desmat') || String(tipo).toLowerCase().includes('Desmatamento')) status = 'DESMATAMENTO';
  else if (String(nivel).toLowerCase().includes('alto') || String(nivel).toLowerCase().includes('crit')) status = 'RISCO';
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

export async function getAlerts(): Promise<ApiResponse<AlertaAmbientalDto[] | Occurrence[]>> {
  const res = await getJson<AlertaAmbientalDto[]>('AlertasAmbientais');
  if (!res.success) return { success: true, data: SAMPLE_FALLBACK } as ApiResponse<any>;
  // map to app occurrences for compatibility
  return { success: true, data: res.data!.map(mapDtoToOccurrence) } as ApiResponse<any>;
}

export async function getAlertById(id: number | string): Promise<ApiResponse<Occurrence>> {
  const res = await getJson<AlertaAmbientalDto>(`AlertasAmbientais/${id}`);
  if (!res.success) return { success: false, error: res.error, status: res.status };
  return { success: true, data: mapDtoToOccurrence(res.data) } as ApiResponse<any>;
}

export async function getPendentes(): Promise<ApiResponse<Occurrence[]>> {
  const res = await getJson<AlertaAmbientalDto[]>('AlertasAmbientais/pendentes');
  if (!res.success) return { success: true, data: SAMPLE_FALLBACK } as ApiResponse<any>;
  return { success: true, data: res.data!.map(mapDtoToOccurrence) } as ApiResponse<any>;
}

export async function createAlert(payload: any): Promise<ApiResponse<Occurrence>> {
  const res = await postJson<AlertaAmbientalDto>('AlertasAmbientais', payload);
  if (!res.success) return { success: false, error: res.error, status: res.status };
  return { success: true, data: mapDtoToOccurrence(res.data) } as ApiResponse<any>;
}

export async function updateAlert(id: number | string, payload: any): Promise<ApiResponse<Occurrence>> {
  const res = await putJson<AlertaAmbientalDto>(`AlertasAmbientais/${id}`, payload);
  if (!res.success) return { success: false, error: res.error, status: res.status };
  return { success: true, data: mapDtoToOccurrence(res.data) } as ApiResponse<any>;
}

export async function resolveAlert(id: number | string): Promise<ApiResponse<Occurrence>> {
  const res = await putJson<AlertaAmbientalDto>(`AlertasAmbientais/${id}/resolver`, null);
  if (!res.success) return { success: false, error: res.error, status: res.status };
  return { success: true, data: mapDtoToOccurrence(res.data) } as ApiResponse<any>;
}

export async function deleteAlert(id: number | string): Promise<ApiResponse<null>> {
  const res = await deleteJson<null>(`AlertasAmbientais/${id}`);
  if (!res.success) return { success: false, error: res.error, status: res.status };
  return { success: true, data: null };
}
