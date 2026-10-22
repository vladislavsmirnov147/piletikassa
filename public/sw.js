// C05 Ülesanne 6 — Teenustöötaja ja võrguta pilet

import { shellFirst } from '../materials/shell-first.js';

export { shellFirst };

const CACHE_NAME = 'piletikassa-v3';

// Rakenduse kest — 5 faili.
const SHELL = [
  '/',
  '/index.html',
  '/app.js',
  '/style.css',
  '/logo.svg'
];

// 1. Install: salvesta kest ja aktiveeri uus versioon.
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(SHELL);
    await self.skipWaiting();
  })());
});

// 2. Activate: eemalda kõik vanad vahemälud.
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();

    await Promise.all(
      names
        .filter((name) => name !== CACHE_NAME)
        .map((name) => caches.delete(name))
    );

    await self.clients.claim();
  })());
});

// 3. Network-first: proovi võrku, vea korral vahemälu.
// Võrgupäringul on kohustuslik ajalõpp.
export async function networkFirst(request, {
  cache,
  fetchFn = fetch,
  timeout = 3000
} = {}) {
  const controller = new AbortController();

  let timer;
  try {
    const response = await Promise.race([
      Promise.resolve().then(() =>
        fetchFn(request, { signal: controller.signal })
      ),
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          controller.abort();
          reject(new Error('Network timeout'));
        }, timeout);
      })
    ]);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    await cache.put(request, response.clone());
    return response;
  } catch (error) {
    const saved = await cache.match(request);
    if (saved) return saved;
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

// 4. Stale-while-revalidate: näita vana, uuenda taustal.
export async function staleWhileRevalidate(request, {
  cache,
  fetchFn = fetch,
  awaitBackground = false
} = {}) {
  const saved = await cache.match(request);

  const update = Promise.resolve()
    .then(() => fetchFn(request))
    .then(async (response) => {
      if (response.ok) {
        await cache.put(request, response.clone());
      }
      return response;
    });

  if (saved) {
    // Taustapäringu viga ei tohi kasutajat segada.
    if (awaitBackground) {
      await update.catch(() => {});
    } else {
      update.catch(() => {});
    }
    return saved;
  }

  return update;
}

// 5. Strateegia valik URL-i järgi.
export function pick(url) {
  const path = new URL(url, 'http://localhost').pathname;

  // Ostuandmeid ei salvestata vahemällu.
  if (path === '/api/orders' || path.startsWith('/api/orders/')) {
    return 'network-only';
  }

  // Pilet peab olema loetav ka ilma võrguta.
  if (/^\/api\/tickets\/[^/]+$/.test(path)) {
    return 'stale-while-revalidate';
  }

  // Sündmuste nimekiri vajab värskeid andmeid.
  if (path === '/api/events') {
    return 'network-first';
  }

  return 'shell-first';
}

// 6. Service Workeri päringute käsitlemine.
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Ära vahemälusta kirjutavaid päringuid.
  if (request.method !== 'GET') return;

  const strategy = pick(request.url);

  if (strategy === 'network-only') return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    if (strategy === 'network-first') {
      return networkFirst(request, { cache });
    }

    if (strategy === 'stale-while-revalidate') {
      return staleWhileRevalidate(request, { cache });
    }

    return shellFirst(request, { cache, fetchFn: fetch });
  })());
});
