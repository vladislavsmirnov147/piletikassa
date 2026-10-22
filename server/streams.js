
import fs from 'node:fs';
import readline from 'node:readline';
import { once } from 'node:events';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

// Loeb kogu faili korraga mällu.
// Seda kasutame voogedastusega võrdlemiseks.
export async function allInMemory(file) {
  const text = await fs.promises.readFile(file, 'utf8');
  return text.split('\n').filter((row) => row.length > 0).length;
}

// Loeb faili rida-realt, hoidmata kogu faili mälus.
export async function streamRows(file) {
  const input = fs.createReadStream(file);
  const lines = readline.createInterface({
    input,
    crlfDelay: Infinity
  });

  let count = 0;

  for await (const line of lines) {
    if (line.length > 0) count += 1;
  }

  return count;
}

// Muudab CSV baiditükid terveteks ridadeks.
// Üks tükk ei pruugi olla üks rida!
export function csvToRows() {
  let remainder = '';
  let firstRow = true;

  return new Transform({
    readableObjectMode: true,

    transform(chunk, encoding, callback) {
      remainder += chunk.toString('utf8');

      const lines = remainder.split('\n');
      remainder = lines.pop();

      for (const line of lines) {
        const clean = line.replace(/\r$/, '');

        if (firstRow) {
          firstRow = false;
          continue;
        }

        if (clean.length > 0) {
          this.push(clean.split(','));
        }
      }

      callback();
    },

    flush(callback) {
      const clean = remainder.replace(/\r$/, '');

      if (clean.length > 0 && !firstRow) {
        this.push(clean.split(','));
      }

      callback();
    }
  });
}

// Arvutab CSV andmeridade arvu ja piletite summa.
// Päiserida jäetakse arvestusest välja.
export async function summary(file) {
  const result = {
    rows: 0,
    tickets: 0
  };

  const input = fs.createReadStream(file);
  const rows = csvToRows();

  rows.on('data', (row) => {
    result.rows += 1;
    result.tickets += Number(row[2]);
  });

  await pipeline(input, rows);

  return result;
}

// Saadab faili vastusesse voona.
// pipeline hoolitseb voo lõpetamise ja vigade eest.
export async function sendAsStream(res, file) {
  await pipeline(fs.createReadStream(file), res);
}

// Kirjutab tükid, arvestades tagasisurvega.
// Kui write() tagastab false, ootame drain-sündmust.
export async function writeWithBackpressure(writable, chunks) {
  let count = 0;
  let pauses = 0;

  for (const chunk of chunks) {
    const canContinue = writable.write(chunk);
    count += 1;

    if (!canContinue) {
      pauses += 1;
      await once(writable, 'drain');
    }
  }

  writable.end();
  await once(writable, 'finish');

  return {
    chunks: count,
    pauses
  };
}
