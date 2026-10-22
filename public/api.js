
 // C05 Ex5 — API-kiht kliendis

import { ApiError } from '../materials/api-error.js';

export { ApiError };

// Üks ühine veatüüp kogu rakenduses.
export function toApiError(err) {
  if (err instanceof ApiError) return err;

  if (err?.name === 'TimeoutError') {
    return new ApiError('Päring aegus', {
      kind: 'timeout',
      reason: err
    });
  }

  if (err?.name === 'AbortError') {
    return new ApiError('Päring katkestati', {
      kind: 'abort',
      reason: err
    });
  }

  if (err instanceof SyntaxError) {
    return new ApiError('Vigane JSON', {
      kind: 'format',
      reason: err
    });
  }

  if (err instanceof TypeError) {
    return new ApiError('Võrguviga', {
      kind: 'network',
      reason: err
    });
  }

  return new ApiError(err?.message || 'Tundmatu viga', {
    kind: 'network',
    reason: err
  });
}

// Serveri andmed teisendatakse rakenduse andmeteks.
export function toEvent(raw) {
  const seats = Number(raw.seats);
  const sold = Number(raw.sold);

  return {
    ...raw,
    start: new Date(raw.start),
    free: seats - sold,
    soldOut: sold >= seats
  };
}

// Kliendivaade ei pea teadma HTTP-st ega URL-idest.
export function makeApi({
  fetchFn = fetch,
  baseUrl = '/api',
  timeout = 5000
} = {}) {
  async function request(path, {
    method = 'GET',
    body,
    signal
  } = {}) {
    const controller = new AbortController();

    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeout);

    const onAbort = () => controller.abort();

    if (signal?.aborted) {
      controller.abort();
    } else {
      signal?.addEventListener('abort', onAbort, { once: true });
    }

    try {
      const headers = {
        Accept: 'application/json'
      };

      if (body !== undefined) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetchFn(baseUrl + path, {
        method,
        headers,
        ...(body !== undefined
          ? { body: JSON.stringify(body) }
          : {}),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new ApiError(
          `HTTP ${response.status}`,
          {
            kind: response.status >= 500 ? 'server' : 'client',
            status: response.status
          }
        );
      }

      try {
        return await response.json();
      } catch (err) {
        throw new ApiError('Vigane JSON', {
          kind: 'format',
          reason: err
        });
      }
    } catch (err) {
      if (timedOut) {
        throw new ApiError('Päring aegus', {
          kind: 'timeout',
          reason: err
        });
      }

      if (signal?.aborted) {
        throw new ApiError('Päring katkestati', {
          kind: 'abort',
          reason: err
        });
      }

      throw toApiError(err);
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
    }
  }

  return {
    async events(search = '') {
      const query = search
        ? `?search=${encodeURIComponent(search)}`
        : '';

      const rows = await request('/events' + query);
      return rows.map(toEvent);
    },

    async event(id) {
      const raw = await request(`/events/${encodeURIComponent(id)}`);
      return toEvent(raw);
    },

    async seatmap(id) {
      return request(`/events/${encodeURIComponent(id)}/seatmap`);
    },

    async buyTickets(event, qty) {
      return request('/tickets', {
        method: 'POST',
        body: { event, qty }
      });
    }
  };
}

// Kolm renderdusviisi: server, client ja API + SPA.
export const RENDER_MODES = {
  server: {
    roundTrips: 1,
    searchEngine: 'HTML-sisu on kohe nähtav.'
  },
  client: {
    roundTrips: 2,
    searchEngine: 'JavaScript peab sisu looma.'
  },
  api_spa: {
    roundTrips: 2,
    searchEngine: 'Sisu sõltub JavaScriptist ja API-st.'
  }
};

export function renderMode({ html, jsonRequests }) {
  const hasContent = /<article\b|<h2\b/i.test(html);

  if (hasContent) return 'server';

  if (jsonRequests > 0) return 'api_spa';

  return 'client';
}
