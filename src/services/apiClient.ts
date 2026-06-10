import { buildApiUrl, getApiBaseUrl } from './config';

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
};

async function parseJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function safeFetch<T = any>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const base = getApiBaseUrl();
    const url = buildApiUrl(path);
    const method = (init && (init.method as string)) || 'GET';

    // Useful debug information for diagnosing connectivity issues
    console.debug('[apiClient] API Base URL utilizada:', base);
    console.debug('[apiClient] fetch ->', method, url, init);

    const res = await fetch(url, init);
    const body = await parseJsonSafe(res);

    if (res.ok) return { success: true, data: body as T, status: res.status };

    let message = 'Erro ao comunicar com o servidor.';
    if (res.status === 401) message = 'Acesso não autorizado.';
    else if (res.status === 404) message = 'Recurso não encontrado.';
    else if (res.status >= 500) message = 'Erro no servidor. Tente novamente mais tarde.';
    if (body && (body.message || body.error)) message = body.message || body.error;

    console.warn('[apiClient] response error', { status: res.status, url, message });

    return { success: false, error: message, status: res.status };
  } catch (err: any) {
    // Log full error for debugging (do not return stack to UI)
    console.error('[apiClient] Network/API error:', err);
    return { success: false, error: 'Não foi possível conectar à API Nexus Verde. Verifique se o backend está em execução.' };
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

/**
 * Helper for multipart/form-data uploads. Intentionally does NOT set
 * the `Content-Type` header so the runtime can add the correct boundary.
 */
export type FileLike = { uri: string; name?: string; type?: string };

export async function postMultipart<T = any>(path: string, data: FormData | FileLike): Promise<ApiResponse<T>> {
  try {
    let fd: FormData;
    // Detect if caller passed a FormData instance (duck-typing append)
    if (data && typeof (data as any).append === 'function') {
      fd = data as FormData;
      console.debug('[apiClient] postMultipart called with existing FormData');
    } else {
      const file = data as FileLike;
      const uri = file?.uri;
      if (!uri) return { success: false, error: 'No file URI provided to postMultipart' };
      const name = file.name ?? 'imagem.jpg';
      const type = file.type ?? 'image/jpeg';
      fd = new FormData();
      fd.append('imagem', { uri, name, type } as any);
      console.log('Imagem enviada:', { uri, name, type });
    }

    // Ensure we don't set Content-Type so fetch can add the multipart boundary
    return safeFetch<T>(path, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: fd,
    });
  } catch (err: any) {
    console.error('[apiClient] postMultipart error', err);
    return { success: false, error: err?.message || 'Erro ao enviar multipart.' };
  }
}
