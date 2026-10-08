/**
 * Shared JSON fetch with request de-duplication and a short TTL cache.
 *
 * Why this exists: the app renders BOTH the mobile frame (lg:hidden) and the
 * desktop frame (hidden lg:flex) at the same time, so every view component is
 * mounted twice — and React StrictMode double-invokes effects in dev. Every
 * plain `fetch()` therefore fired 2–3 identical API calls for one URL.
 *
 * Going through `apiFetchJson()` guarantees each unique URL hits the network
 * at most once per TTL window: concurrent/remount callers share the same
 * in-flight promise, and successful responses are reused for `ttl` ms.
 */
export interface ApiFetchOptions {
  /** Reuse window for successful responses, in ms. Default 60_000. */
  ttl?: number;
  /** Ignore the cached value and start a fresh request (retry buttons). */
  force?: boolean;
  /** Decode legacy double-escaped \uXXXX Tamil sequences before JSON.parse. */
  decodeTamilEscapes?: boolean;
  headers?: Record<string, string>;
}

interface CacheEntry {
  promise: Promise<any>;
  expires: number;
}

const DEFAULT_TTL = 60_000;
const cache = new Map<string, CacheEntry>();

/** Stable cache key: same URL regardless of the `_t` cache-buster. */
function cacheKey(url: string): string {
  try {
    const u = new URL(url, window.location.origin);
    u.searchParams.delete('_t');
    u.searchParams.sort();
    return u.toString();
  } catch {
    return url;
  }
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function apiFetchJson<T = any>(
  url: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const {
    ttl = DEFAULT_TTL,
    force = false,
    decodeTamilEscapes = false,
    headers,
  } = options;
  const key = cacheKey(url);

  if (!force) {
    const hit = cache.get(key);
    if (hit && hit.expires > Date.now()) return hit.promise;
  }

  const promise = (async (): Promise<T> => {
    const res = await fetch(url, {
      headers: { Accept: 'application/json', ...headers },
      cache: 'no-store',
    });
    const text = await res.text();
    if (!res.ok) throw new ApiError(`HTTP ${res.status}`, res.status);
    return JSON.parse(
      decodeTamilEscapes
        ? text.replace(/\\u([0-9a-fA-F]{4})/g, (_, code) =>
            String.fromCharCode(parseInt(code, 16))
          )
        : text
    ) as T;
  })();

  // Register the in-flight promise synchronously so parallel callers
  // (double-mounted frames / StrictMode) join it instead of re-fetching.
  cache.set(key, { promise, expires: Date.now() + ttl });
  // Failures are never cached, so retries hit the network again.
  promise.catch(() => {
    const entry = cache.get(key);
    if (entry && entry.promise === promise) cache.delete(key);
  });
  return promise;
}
