// C05 Ex3 — fetch: neli olekut ja vead

// Õpetaja antud abifunktsioonid
import { readBody } from '../materials/read-response.js';
import { errorToState } from '../materials/error-text.js';

export { errorToState } from '../materials/error-text.js';

// 1. Vastuse lugemine ja vea liigi määramine
export async function readResponse(response) {
  try {
    return await readBody(response);
  } catch (err) {
    if (err.badBody) {
      err.kind = 'format';
    } else if (err.status === 429 || err.status >= 500) {
      err.kind = 'server';
    } else if (err.status >= 400 && err.status < 500) {
      err.kind = 'client';
    }

    throw err;
  }
}

// 2. Andmetest sobiva oleku tegemine
export function stateFromData(rows) {
  if (!Array.isArray(rows)) {
    return {
      state: 'err',
      message: 'Server saatis vigase vastuse.'
    };
  }

  if (rows.length === 0) {
    return {
      state: 'empty',
      message: 'Ükski sündmus ei vasta otsingule.'
    };
  }

  return {
    state: 'data',
    rows
  };
}

// 3. Klient, mis väldib samaaegseid topeltpäringuid
export function createClient(options = {}) {
  const fetchFn = options.fetchFn ?? fetch;
  const url = options.url ?? '/api/events';

  let inFlight = null;

  async function loadEvents() {
    try {
      const response = await fetchFn(url);
      const rows = await readResponse(response);
      return stateFromData(rows);
    } catch (err) {
      return errorToState(err);
    }
  }

  function events() {
    if (inFlight !== null) {
      return inFlight;
    }

    const request = loadEvents();
    inFlight = request;

    request.finally(() => {
      if (inFlight === request) {
        inFlight = null;
      }
    });

    return request;
  }

  return {
    events,
    inFlightCount: () => (inFlight === null ? 0 : 1)
  };
}