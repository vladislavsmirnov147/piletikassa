
// C08 Ülesanne 2 — WebSocket: kanalid ja taasühendus

// 1. Kanalid ja ruumid
export function createHub() {
  const channels = new Map();

  function join(connection, channel) {
    if (!channels.has(channel)) {
      channels.set(channel, new Set());
    }
    channels.get(channel).add(connection);
  }

  function leave(connection, channel) {
    const members = channels.get(channel);
    if (!members) return;

    members.delete(connection);

    // Tühi kanal tuleb kustutada, et vältida mäluleket.
    if (members.size === 0) {
      channels.delete(channel);
    }
  }

  function leaveAll(connection) {
    for (const channel of [...channels.keys()]) {
      leave(connection, channel);
    }
  }

  function send(channel, data) {
    const members = channels.get(channel);
    if (!members) return 0;

    const message = JSON.stringify(data);
    let sent = 0;

    for (const connection of members) {
      if (connection.open === false || connection.readyState === 3) {
        continue;
      }

      connection.send(message);
      sent++;
    }

    return sent;
  }

  function channelsOf(connection) {
    return [...channels.entries()]
      .filter(([, members]) => members.has(connection))
      .map(([name]) => name);
  }

  return {
    join,
    leave,
    leaveAll,
    send,
    channelsOf,
    members: (channel) => channels.get(channel)?.size ?? 0,
    channelCount: () => channels.size
  };
}

// 2. Autentimine ühenduse loomisel
export function authConnection(input, verify) {
  if (input.cookie) {
    const user = verify(input.cookie);

    if (user) {
      return { ok: true, user, via: 'cookie' };
    }
  }

  const message = input.firstMessage;

  if (message?.kind === 'auth' && message.token) {
    const user = verify(message.token);

    if (user) {
      return { ok: true, user, via: 'message' };
    }
  }

  return {
    ok: false,
    code: 4401,
    reason: 'Autentimata'
  };
}

// 3. Sulgemiskoodid
export const CLOSE_CODES = {
  healthy: 1000,
  unauthenticated: 4401,
  forbidden: 4403,
  overload: 4429,
  shuttingDown: 4503
};

export function shouldReconnect(code) {
  if (
    code === CLOSE_CODES.healthy ||
    code === CLOSE_CODES.unauthenticated ||
    code === CLOSE_CODES.forbidden
  ) {
    return false;
  }

  return true;
}

// 4. Kasvava ooteajaga taasühendus
export function createReconnector({
  base = 500,
  factor = 2,
  cap = 30000,
  jitter = 0.2
} = {}) {
  let count = 0;

  function nextDelay() {
    const delay = Math.min(cap, base * factor ** count);
    count++;

    const randomFactor = 1 + (Math.random() * 2 - 1) * jitter;

    return Math.round(delay * randomFactor);
  }

  return {
    nextDelay,
    attempts: () => count,
    succeeded() {
      // Õnnestunud ühendus nullib katsete arvu.
      count = 0;
    }
  };
}

// 5. Ping-pong kontroll
export function createHeartbeat() {
  const connections = new Map();

  function add(connection) {
    connections.set(connection, true);
  }

  function pong(connection) {
    if (connections.has(connection)) {
      connections.set(connection, true);
    }
  }

  function round() {
    const dead = [];

    for (const [connection, alive] of connections) {
      if (!alive) {
        // Katkenud ühendust ei saa viisakalt sulgeda.
        if (typeof connection.terminate === 'function') {
          connection.terminate();
        } else {
          connection.close(1006);
        }

        connections.delete(connection);
        dead.push(connection);
      } else {
        connection.ping();
        connections.set(connection, false);
      }
    }

    return dead;
  }

  return { add, pong, round };
}
