import { ApiResponse, getJson, postJson } from './apiClient';

export type AnaliseAmbientalDto = {
  id: number;
  imagemSatelitalId: number;
  ndviMedio?: number;
  percentualVegetacao?: number;
  percentualSoloExposto?: number;
  percentualAreaQueimada?: number;
  classificacao?: string;
  nivelRisco?: string;
  resumo?: string;
  dataAnalise?: string;
};

const SAMPLE_ANALYSES: AnaliseAmbientalDto[] = [
  { id: 1, imagemSatelitalId: 1, ndviMedio: 0.45, percentualVegetacao: 70, percentualAreaQueimada: 2, classificacao: 'Estavel', nivelRisco: 'Baixo', resumo: 'Análise simulada', dataAnalise: new Date().toISOString() },
];

export async function getAnalyses(): Promise<ApiResponse<AnaliseAmbientalDto[]>> {
  const res = await getJson<AnaliseAmbientalDto[]>('AnalisesAmbientais');
  if (!res.success) return { success: true, data: SAMPLE_ANALYSES } as ApiResponse<any>;
  return res;
}

export async function simulateAnalysis(payload: any): Promise<ApiResponse<AnaliseAmbientalDto>> {
  const res = await postJson<AnaliseAmbientalDto>('AnalisesAmbientais/simular', payload);
  if (!res.success) return { success: false, error: res.error, status: res.status };
  return res;
}

export async function analyzeImage(payload: any): Promise<ApiResponse<any>> {
  const res = await postJson<any>('AnalisesAmbientais/analisar-imagem', payload);
  if (!res.success) return { success: false, error: res.error, status: res.status };
  return res;
}

export async function uploadImage(payload: any): Promise<ApiResponse<any>> {
  const res = await postJson<any>('AnalisesAmbientais/imagens', payload);
  if (!res.success) return { success: false, error: res.error, status: res.status };
  return res;
}

export async function listImages(): Promise<ApiResponse<any>> {
  const res = await getJson<any>('AnalisesAmbientais/imagens');
  if (!res.success) return { success: true, data: [] } as ApiResponse<any>;
  return res;
}
