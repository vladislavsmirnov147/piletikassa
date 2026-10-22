
import http from 'node:http';
import { readBody } from '../materials/body-reader.js';
import { match } from '../materials/route-match.js';
import { json } from '../materials/json-response.js';

export { match };

// Konfiguratsioon kontrollitakse enne serveri käivitamist.
export function readConfig(env = process.env) {
  const required = ['DB_URL', 'SESSION_SECRET'];

  const missing = required.filter(
    (name) => typeof env[name] !== 'string' || !env[name].trim()
  );

  if (missing.length > 0) {
    throw new Error(
      `Puuduvad keskkonnamuutujad: ${missing.join(', ')}`
    );
  }

  const port = Number(env.PORT ?? 3006);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new RangeError('Vigane PORT');
  }

  return {
    port,
    kind: env.NODE_ENV || 'development',
    databaseUrl: env.DB_URL,
    sessionKey: env.SESSION_SECRET
  };
}

// Saladusi ei tohi logisse kirjutada.
export function configForLog(config) {
  return {
    ...config,
    databaseUrl: '***',
    sessionKey: '***'
  };
}

// Käsitleja on serverist eraldi, et teda saaks testida.
export function createHandler(data) {
  return async function handler(req, res) {
    const url = new URL(req.url, 'http://localhost');
    const route = url.pathname;

    // GET /api/events
    if (req.method === 'GET' && match('/api/events', route)) {
      json(res, 200, data);
      return;
    }

    // GET /api/events/:id
    if (req.method === 'GET') {
      const params = match('/api/events/:id', route);

      if (params) {
        const id = Number(params.id);
        const event = data.find((item) => item.id === id);

        if (!event) {
          json(res, 404, { err: 'Sündmust ei leitud' });
          return;
        }

        json(res, 200, event);
        return;
      }
    }

    // POST /api/orders
    if (req.method === 'POST' && match('/api/orders', route)) {
      const body = await readBody(req);

      let order;
      try {
        order = JSON.parse(body);
      } catch {
        json(res, 400, { err: 'Vigane JSON' });
        return;
      }

      if (
        !Number.isInteger(order.event) ||
        !Number.isInteger(order.qty) ||
        order.qty < 1
      ) {
        json(res, 422, { err: 'Vigased väljad' });
        return;
      }

      const event = data.find((item) => item.id === order.event);

      if (!event) {
        json(res, 404, { err: 'Sündmust ei leitud' });
        return;
      }

      json(
        res,
        201,
        {
          id: 9001,
          event: order.event,
          qty: order.qty
        },
        { Location: '/api/orders/9001' }
      );
      return;
    }

    // 404 peab olema kõige viimane.
    json(res, 404, { err: 'Teed ei leitud' });
  };
}

// Asünkroonsed vead ei tohi serveriprotsessi lõpetada.
export function makeServer(data) {
  const handler = createHandler(data);

  return http.createServer((req, res) => {
    Promise.resolve()
      .then(() => handler(req, res))
      .catch((err) => {
        console.error('Päringu viga:', err.message);

        if (res.headersSent || res.destroyed) {
          return;
        }

        const code = err.code === 413 ? 413 : 500;

        json(res, code, {
          err: code === 413 ? 'Keha liiga suur' : 'Serveri viga'
        });
      });
  });
}
