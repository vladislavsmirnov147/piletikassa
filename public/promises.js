// C05 Ex2 — Lubadused ja async/await

// Õpetaja antud funktsioonid
export { wait, delayedValue, delayedError } from '../materials/async-helpers.js';
export { chain } from '../materials/chain-example.js';
export { sequential, parallel, settleAll, withTimeout } from '../materials/combinators.js';

import { delayedValue } from '../materials/async-helpers.js';

// Sama tulemus nagu chain(), aga async/await abil
export async function chainWithAwait(id) {
  const trace = [];

  try {
    const event = await delayedValue(
      { id, name: 'Sügiskontsert' },
      5
    );

    trace.push('sain sündmuse');

    const result = { ...event, price: 24 };
    trace.push('lisasin hinna');

    return { result, trace };
  } catch (err) {
    trace.push('err: ' + err.message);
    return { result: null, trace };
  } finally {
    trace.push('finally');
  }
}