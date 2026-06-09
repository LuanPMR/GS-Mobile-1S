import { ApiResponse, getJson, postJson } from './apiClient';

export type SatelliteSourceDto = {
  id: number;
  nome: string;
  tipo?: string;
  provedor?: string;
  resolucaoMetros?: number;
  frequenciaRevisitaHoras?: number;
  ativo?: boolean;
  dataCadastro?: string;
};

const SAMPLE_SOURCES: SatelliteSourceDto[] = [
  { id: 1, nome: 'MS Lab - MiniSat A', tipo: 'Minissatélite', provedor: 'Nexus', resolucaoMetros: 5, frequenciaRevisitaHoras: 24, ativo: true, dataCadastro: new Date().toISOString() },
];

export async function getSources(): Promise<ApiResponse<SatelliteSourceDto[]>> {
  const res = await getJson<SatelliteSourceDto[]>('FontesSatelitais');
  if (!res.success) return { success: true, data: SAMPLE_SOURCES } as ApiResponse<any>;
  return res;
}

export async function createSource(payload: any): Promise<ApiResponse<SatelliteSourceDto>> {
  const res = await postJson<SatelliteSourceDto>('FontesSatelitais', payload);
  if (!res.success) return { success: false, error: res.error, status: res.status };
  return res;
}
