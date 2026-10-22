// C05 Ex3 — abiserver nelja vastuse katsetamiseks
// See on eraldi testiserver. C04 server.js jääb muutmata.

import http from 'node:http';

const PORT = 3010;

const events = [
  { id: 1, name: 'Sügiskontsert', price: 24 },
  { id: 2, name: 'Talveball', price: 45 },
  { id: 3, name: 'Improteater', price: 15 }
];

function send(res, status, body, type = 'application/json') {
  const content = Buffer.from(body, 'utf8');

  res.writeHead(status, {
    'Content-Type': `${type}; charset=utf-8`,
    'Content-Length': content.length,
    'Cache-Control': 'no-store'
  });

  res.end(content);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname !== '/api/events') {
    return send(res, 404, JSON.stringify({ error: 'Ei leitud' }));
  }

  if (url.searchParams.has('slow')) {
    const ms = Number(url.searchParams.get('slow'));
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  if (url.searchParams.has('err')) {
    return send(res, 500, JSON.stringify({ error: 'Serveri viga' }));
  }

  if (url.searchParams.has('broken')) {
    return send(res, 200, '{"events": [', 'application/json');
  }

  if (url.searchParams.has('empty')) {
    return send(res, 200, '[]');
  }

  return send(res, 200, JSON.stringify(events));
});

server.listen(PORT, () => {
  console.log(`C05 testiserver: http://localhost:${PORT}`);
});