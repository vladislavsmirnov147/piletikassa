// C05 Ex4 — Katkestamine, ajalõpp ja kordamine

// Õpetaja antud funktsioonid
export { waitTime, serverWait } from '../materials/wait-model.js';

import { waitTime, serverWait } from '../materials/wait-model.js';

// Ajalõpp ja väline katkestussignaal
export function timeoutSignal(ms, outerSignal) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort(new DOMException('Ajalõpp', 'TimeoutError'));
  }, ms);

  const onAbort = () => {
    controller.abort(outerSignal.reason);
  };

  if (outerSignal) {
    if (outerSignal.aborted) {
      onAbort();
    } else {
      outerSignal.addEventListener('abort', onAbort, { once: true });
    }
  }

  return {
    signal: controller.signal,
    cleanup() {
      clearTimeout(timeout);
      outerSignal?.removeEventListener('abort', onAbort);
    }
  };
}

// Kas seda päringut tohib korrata?
export function shouldRetry(response, err, method = 'GET') {
  const safeMethods = ['GET', 'HEAD', 'PUT', 'DELETE'];

  if (!safeMethods.includes(method.toUpperCase())) {
    return false;
  }

  if (err) {
    if (err.name === 'AbortError') return false;
    if (err.name === 'TimeoutError') return true;
    return err instanceof TypeError;
  }

  if (!response) return false;

  return response.status === 429 || response.status >= 500;
}

// Päring koos kordamise ja katkestamisega
export async function requestWithRetry(url, options = {}) {
  const {
    fetchFn = fetch,
    method = 'GET',
    attempts = 3,
    timeout = 5000,
    signal,
    wait = (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    base = 200,
    factor = 2,
    cap = 5000,
    jitter = 0
  } = options;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    const timer = timeoutSignal(timeout, signal);

    let response = null;
    let error = null;

    try {
      response = await fetchFn(url, {
        method,
        signal: timer.signal
      });
    } catch (err) {
      error = err;
    } finally {
      timer.cleanup();
    }

    // Kasutaja katkestust ei tohi korrata.
    if (signal?.aborted) {
      throw signal.reason;
    }

    if (!shouldRetry(response, error, method)) {
      if (error) throw error;
      return { response, attempts: attempt };
    }

    if (attempt === attempts) {
      if (error) throw error;
      return { response, attempts: attempt };
    }

    // Serveri Retry-After on tähtsam kui meie arvutatud paus.
    const serverDelay = response ? serverWait(response) : null;
    const delay = serverDelay ?? waitTime(attempt, {
      base,
      factor,
      cap,
      jitter
    });

    await wait(delay);
  }
}