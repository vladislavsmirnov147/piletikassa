
import { randomUUID } from 'node:crypto';
import { mayRead } from './file-access.js';

// C08 Ülesanne 3 — Failide üleslaadimine ja turve

// Faili tüübid ja nende lubatud laiendid.
const TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf']
};

const EXTENSIONS = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'application/pdf': '.pdf'
};

// 1. Turvaline salvestusnimi
// Kasutaja failinimi ei muutu kunagi kettal olevaks nimeks.
export function safeName(originalName, { type } = {}) {
  const raw = String(originalName ?? '');

  // Eemaldame kataloogitee ja ohtlikud märgid kuvanimest.
  const displayName = raw
    .split(/[\\/]/)
    .pop()
    .replace(/["\r\n<>:|?*\x00-\x1f]/g, '_')
    .trim() || 'file';

  // Laiend tuleb kontrollitud tüübist, mitte kasutaja nimest.
  const extension = EXTENSIONS[type] ?? '.bin';

  return {
    storedName: randomUUID() + extension,
    displayName
  };
}

// 2. Failitüübi tuvastamine sisu esimeste baitide järgi
export function detectType(buffer) {
  if (!Buffer.isBuffer(buffer)) return null;

  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return 'image/jpeg';
  }

  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    )
  ) {
    return 'image/png';
  }

  if (
    buffer.length >= 6 &&
    ['GIF87a', 'GIF89a'].includes(buffer.toString('ascii', 0, 6))
  ) {
    return 'image/gif';
  }

  // RIFF üksi ei ole WebP: WAV kasutab samuti RIFF-i.
  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }

  if (
    buffer.length >= 5 &&
    buffer.toString('ascii', 0, 5) === '%PDF-'
  ) {
    return 'application/pdf';
  }

  return null;
}

// 3. Kontrollime sisu, väidetavat tüüpi ja laiendit.
export function checkFile({
  claimedType,
  fileName,
  content,
  maxBytes = 10 * 1024 * 1024
} = {}) {
  const errors = [];

  if (!Buffer.isBuffer(content) || content.length === 0) {
    return {
      ok: false,
      actual: null,
      errors: ['fail on tühi']
    };
  }

  if (content.length > maxBytes) {
    errors.push('fail on liiga suur');
  }

  const actual = detectType(content);

  if (!actual) {
    errors.push('tundmatu failitüüp');
  }

  if (claimedType && actual && claimedType !== actual) {
    errors.push('väidetav tüüp ei klapi faili sisuga');
  }

  if (fileName && actual) {
    const extension = fileName
      .toLowerCase()
      .match(/\.[a-z0-9]+$/)?.[0];

    if (!TYPES[actual]?.includes(extension)) {
      errors.push('failinime laiend ei klapi faili sisuga');
    }
  }

  return {
    ok: errors.length === 0,
    actual,
    errors
  };
}

// 4. Avaliku ja kaitstud faili ligipääsuotsus
export function accessDecision({ file, user = null } = {}) {
  if (file?.isPublic) {
    return {
      allow: true,
      code: 200,
      cache: 'public, max-age=31536000, immutable'
    };
  }

  if (!user) {
    return {
      allow: false,
      code: 401,
      cache: 'private, no-store'
    };
  }

  // Õiguste reegel tuleb õpetaja antud file-access.js failist.
  if (!mayRead(user, file)) {
    return {
      allow: false,
      code: 403,
      cache: 'private, no-store'
    };
  }

  return {
    allow: true,
    code: 200,
    cache: 'private, no-store'
  };
}

// 5. Kolme salvestusviisi võrdlus
export const STORES = {
  filesystem: {
    scales: false,
    download: 'sinu server'
  },
  database: {
    scales: true,
    download: 'sinu server'
  },
  object_store: {
    scales: true,
    download: 'otse hoidlast'
  }
};

// Hoidla valik sõltub serverite arvust, faili suurusest
// ja sellest, kas on vaja andmebaasi tehingut.
export function suggestStore({
  instances = 1,
  fileSizeMb = 0,
  needsTransaction = false
} = {}) {
  if (needsTransaction && fileSizeMb <= 1) {
    return 'database';
  }

  if (instances > 1 || fileSizeMb >= 10) {
    return 'object_store';
  }

  return 'filesystem';
}
