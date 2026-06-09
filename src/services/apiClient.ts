import { buildApiUrl } from './config';

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
};

async function parseJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function safeFetch<T = any>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const url = buildApiUrl(path);
    const res = await fetch(url, init);
    const body = await parseJsonSafe(res);

    if (res.ok) return { success: true, data: body as T, status: res.status };

    let message = 'Erro ao comunicar com o servidor.';
    if (res.status === 401) message = 'Acesso não autorizado.';
    else if (res.status === 404) message = 'Recurso não encontrado.';
    else if (res.status >= 500) message = 'Erro no servidor. Tente novamente mais tarde.';
    if (body && (body.message || body.error)) message = body.message || body.error;

    return { success: false, error: message, status: res.status };
  } catch (err: any) {
    console.error('Network/API error:', err);
    return { success: false, error: 'Não foi possível conectar ao servidor. Verifique a URL da API e sua conexão.' };
  }
}

export async function getJson<T = any>(path: string): Promise<ApiResponse<T>> {
  return safeFetch<T>(path, { method: 'GET', headers: { Accept: 'application/json' } });
}

export async function postJson<T = any>(path: string, body: any): Promise<ApiResponse<T>> {
  return safeFetch<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function putJson<T = any>(path: string, body: any): Promise<ApiResponse<T>> {
  return safeFetch<T>(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function deleteJson<T = any>(path: string): Promise<ApiResponse<T>> {
  return safeFetch<T>(path, { method: 'DELETE', headers: { Accept: 'application/json' } });
}
