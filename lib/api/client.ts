/**
 * The one door to the rahgeer-be API.
 *
 * Every backend response is wrapped in the envelope
 *   { data, status: "success" | "error", status_code }
 * — this client unwraps it, so callers only ever see `data` (or catch
 * ApiError). It also transparently manages the guest session id and the
 * JWT access token.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

const GUEST_SESSION_KEY = "rahgeer:guest-session";
const ACCESS_TOKEN_KEY = "rahgeer:access-token";
const REFRESH_TOKEN_KEY = "rahgeer:refresh-token";

type Envelope<T> = {
  data: T;
  status: "success" | "error";
  status_code: number;
};

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public detail: unknown,
  ) {
    super(`API error ${statusCode}`);
  }
}

// --- token/session storage (browser only; SSR-safe no-ops) -----------------

const storage = {
  get: (key: string) =>
    typeof window === "undefined" ? null : window.localStorage.getItem(key),
  set: (key: string, value: string) => {
    if (typeof window !== "undefined") window.localStorage.setItem(key, value);
  },
  remove: (key: string) => {
    if (typeof window !== "undefined") window.localStorage.removeItem(key);
  },
};

export const session = {
  guestSessionId: () => storage.get(GUEST_SESSION_KEY),
  setGuestSessionId: (id: string) => storage.set(GUEST_SESSION_KEY, id),
  accessToken: () => storage.get(ACCESS_TOKEN_KEY),
  setTokens: (access: string, refresh: string) => {
    storage.set(ACCESS_TOKEN_KEY, access);
    storage.set(REFRESH_TOKEN_KEY, refresh);
  },
  refreshToken: () => storage.get(REFRESH_TOKEN_KEY),
  clearTokens: () => {
    storage.remove(ACCESS_TOKEN_KEY);
    storage.remove(REFRESH_TOKEN_KEY);
  },
  isLoggedIn: () => Boolean(storage.get(ACCESS_TOKEN_KEY)),
};

// --- core fetch -------------------------------------------------------------

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** attach Authorization header (default: true when a token exists) */
  auth?: boolean;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };
  const token = session.accessToken();
  if (auth && token) finalHeaders["Authorization"] = `Bearer ${token}`;
  const guestId = session.guestSessionId();
  if (guestId) finalHeaders["X-Guest-Session"] = guestId;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const envelope = (await response.json()) as Envelope<T>;
  if (envelope.status === "error") {
    throw new ApiError(envelope.status_code, envelope.data);
  }
  return envelope.data;
}

export { BASE_URL };
