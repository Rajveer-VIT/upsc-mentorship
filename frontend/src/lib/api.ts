import { API_BASE_URL } from './constants';

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

/** Typed fetch wrapper: adds JSON + auth headers and unwraps the backend ApiResponse<T>. */
export async function api<T = unknown>(
  path: string,
  init: RequestInit & { auth?: 'user' | 'admin' } = {}
): Promise<T> {
  const { auth, headers, ...rest } = init;
  const token =
    typeof window !== 'undefined' && auth
      ? localStorage.getItem(auth === 'admin' ? 'admin_accessToken' : 'user_accessToken')
      : null;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (res.status === 401) throw new ApiError('Your session has expired. Please log in again.', 401);
  const body = await res.json().catch(() => null);
  if (!res.ok || body?.success === false) {
    throw new ApiError(body?.message || `Request failed (${res.status})`, res.status);
  }
  return body?.data as T;
}

let warmed = false;
/**
 * The API host sleeps when idle (free/shared hosting cold start). Ping it as soon as
 * an auth/checkout page mounts so it is awake by the time the user submits the form.
 */
export function warmUpApi() {
  if (warmed || typeof window === 'undefined') return;
  warmed = true;
  fetch(`${API_BASE_URL}/health`, { cache: 'no-store' }).catch(() => {});
}

/** Persists the session for both the Zustand store (via caller) and the middleware cookie. */
export function setAuthCookie(name: 'user_auth_token' | 'admin_auth_token', token: string) {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${token}; path=/; max-age=604800; SameSite=Lax${secure}`;
}

/** Only allow same-site relative redirects (prevents open-redirects via ?redirect=). */
export function safeRedirect(target: string | null, fallback = '/') {
  return target && target.startsWith('/') && !target.startsWith('//') ? target : fallback;
}
