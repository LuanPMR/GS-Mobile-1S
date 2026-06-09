import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse } from './apiClient';

export type RegionDto = {
  id: number;
  nome: string;
  bioma?: string;
  estado?: string;
  pais?: string;
  latitude?: number | null;
  longitude?: number | null;
  areaKm2?: number | null;
  dataCadastro?: string;
  ativa?: boolean;
};

const STORAGE_KEY = 'nexusverde_regions_v1';
const LAST_ID_KEY = 'nexusverde_regions_last_id';

const DEFAULT_REGIONS: RegionDto[] = [
  {
    id: 1,
    nome: 'Amazônia',
    bioma: 'Amazonia',
    estado: 'AC',
    pais: 'BR',
    latitude: -3.4653,
    longitude: -62.2159,
    areaKm2: 4000000,
    dataCadastro: new Date().toISOString(),
    ativa: true,
  },
];

async function loadAll(): Promise<RegionDto[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      await AsyncStorage.setItem(LAST_ID_KEY, String(DEFAULT_REGIONS[DEFAULT_REGIONS.length - 1].id));
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_REGIONS));
      return DEFAULT_REGIONS;
    }
    const parsed = JSON.parse(raw) as RegionDto[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load regions from AsyncStorage', e);
    return DEFAULT_REGIONS;
  }
}

async function saveAll(regs: RegionDto[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(regs));
  } catch (e) {
    console.error('Failed to save regions to AsyncStorage', e);
    throw e;
  }
}

export async function getRegions(): Promise<ApiResponse<RegionDto[]>> {
  try {
    const regs = await loadAll();
    return { success: true, data: regs };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Falha ao carregar regiões.' };
  }
}

export async function getRegionById(id: number | string): Promise<ApiResponse<RegionDto>> {
  try {
    const regs = await loadAll();
    const n = Number(id);
    const found = regs.find((r) => r.id === n);
    if (!found) return { success: false, status: 404, error: 'Região não encontrada.' };
    return { success: true, data: found };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Falha ao carregar região.' };
  }
}

export async function createRegion(payload: any): Promise<ApiResponse<RegionDto>> {
  try {
    const regs = await loadAll();
    const lastRaw = await AsyncStorage.getItem(LAST_ID_KEY);
    const last = lastRaw ? Number(lastRaw) : (regs.length ? Math.max(...regs.map((r) => r.id)) : 0);
    const id = last + 1;
    const now = new Date().toISOString();

    const region: RegionDto = {
      id,
      nome: payload.nome ?? payload.Nome ?? 'Sem nome',
      bioma: payload.bioma ?? payload.Bioma ?? '',
      estado: payload.estado ?? payload.Estado ?? null,
      pais: payload.pais ?? payload.Pais ?? null,
      latitude: payload.latitude != null ? Number(payload.latitude) : payload.Latitude ?? null,
      longitude: payload.longitude != null ? Number(payload.longitude) : payload.Longitude ?? null,
      areaKm2: payload.areaKm2 != null ? Number(payload.areaKm2) : payload.AreaKm2 ?? null,
      dataCadastro: now,
      ativa: payload.ativa != null ? Boolean(payload.ativa) : true,
    };

    regs.push(region);
    await saveAll(regs);
    await AsyncStorage.setItem(LAST_ID_KEY, String(id));

    return { success: true, data: region };
  } catch (e: any) {
    console.error('createRegion error', e);
    return { success: false, error: e?.message || 'Falha ao criar região.' };
  }
}

export async function updateRegion(id: number | string, payload: any): Promise<ApiResponse<RegionDto>> {
  try {
    const regs = await loadAll();
    const n = Number(id);
    const idx = regs.findIndex((r) => r.id === n);
    if (idx === -1) return { success: false, status: 404, error: 'Região não encontrada.' };

    const current = regs[idx];
    const updated: RegionDto = {
      ...current,
      nome: payload.nome ?? payload.Nome ?? current.nome,
      bioma: payload.bioma ?? payload.Bioma ?? current.bioma,
      estado: payload.estado ?? payload.Estado ?? current.estado,
      pais: payload.pais ?? payload.Pais ?? current.pais,
      latitude: payload.latitude != null ? Number(payload.latitude) : payload.Latitude ?? current.latitude,
      longitude: payload.longitude != null ? Number(payload.longitude) : payload.Longitude ?? current.longitude,
      areaKm2: payload.areaKm2 != null ? Number(payload.areaKm2) : payload.AreaKm2 ?? current.areaKm2,
      ativa: payload.ativa != null ? Boolean(payload.ativa) : current.ativa,
    };

    regs[idx] = updated;
    await saveAll(regs);
    return { success: true, data: updated };
  } catch (e: any) {
    console.error('updateRegion error', e);
    return { success: false, error: e?.message || 'Falha ao atualizar região.' };
  }
}

export async function deleteRegion(id: number | string): Promise<ApiResponse<null>> {
  try {
    const regs = await loadAll();
    const n = Number(id);
    const idx = regs.findIndex((r) => r.id === n);
    if (idx === -1) return { success: false, status: 404, error: 'Região não encontrada.' };
    regs.splice(idx, 1);
    await saveAll(regs);
    return { success: true, data: null };
  } catch (e: any) {
    console.error('deleteRegion error', e);
    return { success: false, error: e?.message || 'Falha ao excluir região.' };
  }
}
