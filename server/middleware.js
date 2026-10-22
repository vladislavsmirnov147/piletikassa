
import { randomUUID } from 'node:crypto';

// Võtab kliendi X-Request-Id üle või loob uue ID.
// Sama ID lisatakse ka HTTP-vastuse päisesse.
export function requestId(req, res, next) {
  const id = req.get('X-Request-Id') || randomUUID();

  req.id = id;
  res.set('X-Request-Id', id);

  next();
}
