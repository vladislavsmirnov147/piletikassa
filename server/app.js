
import express from 'express';

import { requestId } from './middleware.js';
import { eventsRouter, ordersRouter } from './routes.js';

import { logger } from '../materials/logger.js';
import { notFound } from '../materials/express-helpers.js';
import { errorHandler } from '../materials/error-middleware.js';
import { makeErrorResponse } from './errors.js';

// Expressi rakendus ja vahevara ahel.
export function createApp(store, { log = console.log } = {}) {
  const app = express();

  // 1. Päringu ID peab olema enne teisi vahevarasid.
  app.use(requestId);

  // 2. Logimine mõõdab aega kuni vastuse lõpuni.
  app.use(logger(log));

  // 3. JSON-keha lugemine, maksimaalselt 10 kB.
  app.use(express.json({ limit: '10kb' }));

  // 4. Staatilised failid.
  app.use(express.static('public'));

  // 5. API marsruudid.
  app.use('/api/events', eventsRouter(store));
  app.use('/api/orders', ordersRouter(store));

  // 6. Tervisekontroll.
  app.get('/api/health', (req, res) => {
    res.status(200).json({ ok: true });
  });

  // 7. Tundmatu tee: alati pärast kõiki marsruute.
  app.use(notFound);

  // 8. Veakäsitleja on ahela lõpus.
  // Nelja parameetriga käsitleja tunneb Express ära.
  // Arenduses näidatakse veapinu, tootmises peidetakse.
  app.use(errorHandler(
    makeErrorResponse({
      isDev: process.env.NODE_ENV !== 'production'
    }),
    log
  ));

  return app;
}
