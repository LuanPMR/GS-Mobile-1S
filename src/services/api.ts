export const API_BASE = (process.env as any).EXPO_PUBLIC_API_URL ?? 'https://api.example.com';

export async function apiGet<T = unknown>(path: string) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API GET ${path} failed: ${res.status}`);
  return (await res.json()) as T;
}

export async function apiPost<T = unknown>(path: string, body: unknown) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API POST ${path} failed: ${res.status}`);
  return (await res.json()) as T;
}
