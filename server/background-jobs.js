
/*
 * C08 Ülesanne 4 — Taustatööd, cron ja idempotentsus
 * Piletikassa
 */

// 1. Idempotentsusvõtme haldamine
export function createIdempotency({
  ttl = 60_000,
  clock = () => Date.now()
} = {}) {
  const records = new Map();

  function getActive(key) {
    const record = records.get(key);

    if (record && clock() - record.createdAt >= ttl) {
      records.delete(key);
      return null;
    }

    return record ?? null;
  }

  return {
    start(key, bodyHash) {
      const record = getActive(key);

      if (!record) {
        records.set(key, {
          bodyHash,
          createdAt: clock(),
          state: 'running',
          response: null
        });

        return { kind: 'next' };
      }

      if (record.bodyHash !== bodyHash) {
        return { kind: 'conflict' };
      }

      if (record.state === 'running') {
        return { kind: 'running' };
      }

      return {
        kind: 'repeat',
        response: record.response
      };
    },

    finish(key, response) {
      const record = getActive(key);

      if (record) {
        record.state = 'finished';
        record.response = response;
      }
    },

    abort(key) {
      records.delete(key);
    }
  };
}

// 2. Taustatööde järjekord, korduskatsed ja surnukirjad
export function createQueue({
  maxAttempts = 3,
  clock = () => Date.now()
} = {}) {
  const waiting = [];
  const completed = [];
  const deadLetters = [];
  const keys = new Set();

  let nextId = 1;

  return {
    add(kind, data, options = {}) {
      const idempotencyKey = options.idempotencyKey;

      if (idempotencyKey && keys.has(idempotencyKey)) {
        return null;
      }

      if (idempotencyKey) {
        keys.add(idempotencyKey);
      }

      const job = {
        id: nextId++,
        kind,
        data,
        attempts: 0,
        createdAt: clock(),
        idempotencyKey
      };

      waiting.push(job);
      return job;
    },

    pending() {
      return waiting.length;
    },

    done() {
      return completed.length;
    },

    dead() {
      return deadLetters;
    },

    async process(handlers = {}) {
      if (waiting.length === 0) {
        return { ok: false };
      }

      const job = waiting.shift();
      job.attempts += 1;

      try {
        const handler = handlers[job.kind];

        if (typeof handler !== 'function') {
          throw new Error(`Tundmatu töö: ${job.kind}`);
        }

        const result = await handler(job.data, job);

        completed.push({
          ...job,
          result
        });

        return {
          ok: true,
          result,
          retried: false
        };
      } catch (error) {
        const err = error instanceof Error
          ? error.message
          : String(error);

        if (job.attempts < maxAttempts) {
          waiting.push(job);

          return {
            ok: false,
            retried: true,
            err
          };
        }

        deadLetters.push({
          ...job,
          err
        });

        return {
          ok: false,
          retried: false,
          err
        };
      }
    }
  };
}

// 3. E-kirja töö seotakse konkreetse ostuga
export function mailJob(order, event) {
  return {
    kind: 'email',
    data: {
      target: order.email,
      topic: `Piletikassa: ${event.name}`,
      orderId: order.id,
      eventName: event.name,
      idempotencyKey: `email:order:${order.id}`
    }
  };
}

// 4. Cron-i ajaakna idempotentsusvõti
export function windowKey(
  name,
  time = Date.now(),
  windowMs = 60 * 60 * 1000
) {
  const windowNumber = Math.floor(time / windowMs);
  return `${name}:${windowNumber}`;
}

// 5. Aegunud kohtade hoidude vabastamine
export function releaseExpiredHolds(holds, now = Date.now()) {
  const released = [];

  for (const hold of holds) {
    // Kontrollime SEISU, mitte ainult aegumisaega.
    if (
      hold.state === 'pending' &&
      hold.expiresAt <= now
    ) {
      hold.state = 'expired';
      released.push(hold.id);
    }
  }

  return released;
}
