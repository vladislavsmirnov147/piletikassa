// C05 Ex4 — kahe kliendi ooteaegade mõõtmine

const base = 200;
const factor = 2;
const cap = 5000;

function waitTime(attempt, jitter = false) {
  const delay = Math.min(cap, base * factor ** (attempt - 1));
  return jitter ? Math.round(delay + Math.random() * 100) : delay;
}

async function measureClient(name, jitter) {
  const pauses = [];

  for (let attempt = 1; attempt <= 3; attempt++) {
    const delay = waitTime(attempt, jitter);
    const start = performance.now();

    await new Promise(resolve => setTimeout(resolve, delay));

    pauses.push(Math.round(performance.now() - start));
  }

  console.log(`${name}: ${pauses.join(' ')} ms`);
}

console.log('Ilma jitterita:');
await Promise.all([
  measureClient('A', false),
  measureClient('B', false)
]);

console.log('Jitteriga:');
await Promise.all([
  measureClient('A', true),
  measureClient('B', true)
]);