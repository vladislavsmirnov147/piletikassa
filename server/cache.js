
/*
 * C08 Ülesanne 5 — Tagasisurve ja serveri vahemälu
 * Piletikassa
 */

// 1. Tagasisurve strateegiate kirjeldused
export const STRATEGIES = {
  drop_new: {
    loses: 'uued teated',
    fits: 'olulised vanemad teated'
  },
  drop_old: {
    loses: 'vanad teated',
    fits: 'värskemad reaalaja uuendused'
  },
  last_only: {
    loses: 'vahepealsed seisud',
    fits: 'hetkeseis, näiteks kohtade saadavus'
  },
  buffer: {
    loses: 'mitte midagi',
    fits: 'tootmises mitte kunagi piiramatu puhvrina'
  }
};

// 2. Aeglase kliendi teadete järjekord
export function createStream({
  strategy = 'drop_old',
  cap = 3,
  send = () => {}
} = {}) {
  if (!Object.hasOwn(STRATEGIES, strategy)) {
    throw new RangeError('Tundmatu strateegia');
  }

  const queue = [];
  let lostCount = 0;

  return {
    add(message) {
      if (strategy === 'last_only') {
        lostCount += queue.length;
        queue.length = 0;
        queue.push(message);
        return;
      }

      if (strategy === 'buffer') {
        queue.push(message);
        return;
      }

      if (queue.length < cap) {
        queue.push(message);
        return;
      }

      if (strategy === 'drop_new') {
        lostCount++;
        return;
      }

      if (strategy === 'drop_old') {
        queue.shift();
        lostCount++;
        queue.push(message);
      }
    },

    pending() {
      return queue.length;
    },

    lost() {
      return lostCount;
    },

    clear(limit = Infinity) {
      let count = 0;

      while (queue.length > 0 && count < limit) {
        send(queue.shift());
        count++;
      }

      return count;
    }
  };
}

// 3. WebSocket-kliendi sulgemine suure puhvri korral
export function shouldClose(bufferedAmount) {
  return bufferedAmount > 1024 * 1024;
}

// 4. Serveri vahemälu: TTL, LRU ja sildid
export function createCache({
  ttl = 300_000,
  cap = 100,
  clock = () => Date.now()
} = {}) {
  const entries = new Map();
  let hits = 0;
  let misses = 0;

  return {
    read(key) {
      const entry = entries.get(key);

      if (!entry) {
        misses++;
        return undefined;
      }

      if (clock() >= entry.expiresAt) {
        entries.delete(key);
        misses++;
        return undefined;
      }

      // LRU: loetud kirje muutub kõige uuemaks.
      entries.delete(key);
      entries.set(key, entry);
      hits++;

      return entry.value;
    },

    write(key, value, tags = []) {
      entries.delete(key);

      entries.set(key, {
        value,
        tags: [...tags],
        expiresAt: clock() + ttl
      });

      // Kui maht ületab piiri, eemaldame vanima kirje.
      while (entries.size > cap) {
        const oldest = entries.keys().next().value;
        entries.delete(oldest);
      }
    },

    evictTag(tag) {
      let removed = 0;

      for (const [key, entry] of entries) {
        if (entry.tags.includes(tag)) {
          entries.delete(key);
          removed++;
        }
      }

      return removed;
    },

    size() {
      return entries.size;
    },

    stats() {
      return { hits, misses };
    }
  };
}

// 5. Otsus, kas andmeid võib jagatud vahemällu panna
export function mayCache({
  secret = false,
  perUser = false,
  changesOften = false
} = {}) {
  if (secret) {
    return {
      allowed: false,
      reason: 'Salajasi andmeid ei tohi jagatud vahemällu salvestada.',
      ttl: 0
    };
  }

  if (perUser) {
    return {
      allowed: false,
      reason: 'Kasutajapõhised andmed ei sobi jagatud vahemällu, sest need võivad põhjustada andmete lekke.',
      ttl: 0
    };
  }

  return {
    allowed: true,
    reason: 'Avalikke andmeid võib vahemällu salvestada.',
    ttl: changesOften ? 5_000 : 300_000
  };
}
