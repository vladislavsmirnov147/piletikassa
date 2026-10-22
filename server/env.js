
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { versionRange } from '../materials/npm-semver.js';

export { versionRange };

export const HERE = path.dirname(fileURLToPath(import.meta.url));

export function envVars() {
  return {
    browserOnly: {
      document: typeof document !== 'undefined',
      window: typeof window !== 'undefined',
      localStorage: typeof localStorage !== 'undefined'
    },
    nodeOnly: {
      process: typeof process !== 'undefined',
      Buffer: typeof Buffer !== 'undefined',
      __dirname_in_module: typeof __dirname !== 'undefined'
    },
    inBoth: {
      fetch: typeof fetch !== 'undefined',
      URL: typeof URL !== 'undefined'
    }
  };
}

export async function readEvents(file) {
  const content = await fs.readFile(file, 'utf8');
  return JSON.parse(content);
}

export async function writeReport(target, rows) {
  const lines = ['id,name,sold,seats'];

  for (const row of rows) {
    const name = String(row.name).replaceAll('"', '""');
    lines.push(`${row.id},"${name}",${row.sold},${row.seats}`);
  }

  const content = lines.join('\n');
  const temp = target + '.tmp';

  try {
    await fs.writeFile(temp, content, 'utf8');
    await fs.rename(temp, target);
  } catch (error) {
    await fs.unlink(temp).catch(() => {});
    throw error;
  }

  return content.length;
}

export function processInfo() {
  return {
    node: process.version,
    cores: os.cpus().length,
    mem_mb: Math.round(process.memoryUsage().rss / (1024 * 1024))
  };
}
