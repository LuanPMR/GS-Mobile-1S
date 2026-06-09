/**
 * API integration layer (placeholders only).
 *
 * IMPORTANT: do NOT create the backend here. Replace `API_BASE_URL` with your
 * backend address when ready. For local development, use the machine IP
 * accessible from the device/emulator (e.g. `http://192.168.0.10:8080`).
 * - Android emulator (classic): use `10.0.2.2` to reach host machine.
 * - Expo Go on device: use your computer LAN IP (e.g. `http://192.168.x.x:8080`).
 * You can also set `EXPO_PUBLIC_API_URL` in your environment to override.
 */

export const API_BASE_URL: string = (process.env as any).EXPO_PUBLIC_API_URL ?? 'http://192.168.0.100:8080';

export function setApiBaseUrl(url: string) {
  // This is a simple runtime override for testing. Prefer env-variable in production.
  (process.env as any).EXPO_PUBLIC_API_URL = url;
}

/**
 * Occurrence model (backend will provide these fields)
 */
export type Occurrence = {
  id: string | number;
  regionName: string;
  satelliteCode: string;
  status: 'PRESERVADA' | 'DESMATAMENTO' | 'QUEIMADA' | 'RISCO';
  vegetationColor: 'VERDE' | 'MARROM' | 'PRETO';
  description?: string;
  detectedAt: string; // ISO timestamp
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
};

async function handleResponse<T>(res: Response): Promise<ApiResponse<T>> {
  let body: any = null;
  try {
    body = await res.json();
  } catch (e) {
    // ignore JSON parse errors
  }

  if (res.ok) return { success: true, data: body as T, status: res.status };

  // Derive friendly message
  const serverMessage = body?.message || body?.error || null;
  let message = 'Erro ao comunicar com o servidor.';
  if (res.status === 401) message = 'Acesso não autorizado.';
  else if (res.status === 404) message = 'Recurso não encontrado.';
  else if (res.status >= 500) message = 'Erro no servidor. Tente novamente mais tarde.';
  if (serverMessage) message = serverMessage;

  return { success: false, error: message, status: res.status };
}

function friendlyNetworkError(err: unknown) {
  console.error('Network/API error:', err);
  return { success: false, error: 'Não foi possível conectar ao servidor. Verifique a URL da API e sua conexão.' };
}

function getBase() {
  const env = (process.env as any).EXPO_PUBLIC_API_URL;
  const raw = env ?? API_BASE_URL;
  return String(raw).replace(/\/+$/, '');
}

/**
 * GET /occurrences
 */
export async function getOccurrences(): Promise<ApiResponse<Occurrence[]>> {
  try {
    const res = await fetch(`${getBase()}/occurrences`, { headers: { Accept: 'application/json' } });
    return await handleResponse<Occurrence[]>(res);
  } catch (err) {
    return friendlyNetworkError(err) as ApiResponse<Occurrence[]>;
  }
}

/**
 * GET /occurrences/:id
 */
export async function getOccurrenceById(id: string | number): Promise<ApiResponse<Occurrence>> {
  try {
    const res = await fetch(`${getBase()}/occurrences/${id}`, { headers: { Accept: 'application/json' } });
    return await handleResponse<Occurrence>(res);
  } catch (err) {
    return friendlyNetworkError(err) as ApiResponse<Occurrence>;
  }
}

/**
 * POST /occurrences
 */
export async function createOccurrence(data: Omit<Occurrence, 'id'>): Promise<ApiResponse<Occurrence>> {
  try {
    const res = await fetch(`${getBase()}/occurrences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleResponse<Occurrence>(res);
  } catch (err) {
    return friendlyNetworkError(err) as ApiResponse<Occurrence>;
  }
}

/**
 * PUT /occurrences/:id
 */
export async function updateOccurrence(id: string | number, data: Partial<Omit<Occurrence, 'id'>>): Promise<ApiResponse<Occurrence>> {
  try {
    const res = await fetch(`${getBase()}/occurrences/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleResponse<Occurrence>(res);
  } catch (err) {
    return friendlyNetworkError(err) as ApiResponse<Occurrence>;
  }
}

/**
 * DELETE /occurrences/:id
 */
export async function deleteOccurrence(id: string | number): Promise<ApiResponse<null>> {
  try {
    const res = await fetch(`${getBase()}/occurrences/${id}`, { method: 'DELETE', headers: { Accept: 'application/json' } });
    return await handleResponse<null>(res);
  } catch (err) {
    return friendlyNetworkError(err) as ApiResponse<null>;
  }
}

