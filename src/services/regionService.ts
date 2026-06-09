import { ApiResponse, deleteJson, getJson, postJson, putJson } from './apiClient';

export type RegionDto = {
  id: number;
  nome: string;
  bioma?: string;
  estado?: string;
  pais?: string;
  latitude?: number;
  longitude?: number;
  areaKm2?: number;
  dataCadastro?: string;
  ativa?: boolean;
};

const SAMPLE_REGIONS: RegionDto[] = [
  { id: 1, nome: 'Amazônia', bioma: 'Floresta', estado: 'AC', pais: 'BR', latitude: -3.4653, longitude: -62.2159, areaKm2: 4000000, dataCadastro: new Date().toISOString(), ativa: true },
];

export async function getRegions(): Promise<ApiResponse<RegionDto[]>> {
  const res = await getJson<RegionDto[]>('RegioesMonitoradas');
  if (!res.success) return { success: true, data: SAMPLE_REGIONS } as ApiResponse<any>;
  return res;
}

export async function getRegionById(id: number | string): Promise<ApiResponse<RegionDto>> {
  const res = await getJson<RegionDto>(`RegioesMonitoradas/${id}`);
  if (!res.success) return { success: false, error: res.error, status: res.status };
  return res;
}

export async function createRegion(payload: any): Promise<ApiResponse<RegionDto>> {
  const res = await postJson<RegionDto>('RegioesMonitoradas', payload);
  if (!res.success) return { success: false, error: res.error, status: res.status };
  return res;
}

export async function updateRegion(id: number | string, payload: any): Promise<ApiResponse<RegionDto>> {
  const res = await putJson<RegionDto>(`RegioesMonitoradas/${id}`, payload);
  if (!res.success) return { success: false, error: res.error, status: res.status };
  return res;
}

export async function deleteRegion(id: number | string): Promise<ApiResponse<null>> {
  const res = await deleteJson<null>(`RegioesMonitoradas/${id}`);
  if (!res.success) return { success: false, error: res.error, status: res.status };
  return { success: true, data: null };
}
