
/*
 * C08 Ülesanne 6 — Olekuta server
 * Piletikassa
 *
 * Rakenduse olek ei tohi sõltuda ühest serverieksemplarist.
 * Kõik eksemplarid peavad nägema samu vajalikke andmeid.
 */

// 1. Kuus probleemi, kui olekut hoitakse ühe serveri mälus.
export const IN_MEMORY_STATE = {
  session: {
    symptom: 'juhuslik väljalogimine',
    fix: 'Hoia sessioone ühises Redis-hoidlas.'
  },

  cache: {
    symptom: 'vastus sõltub sellest, kuhu päring sattus',
    fix: 'Kasuta ühist Redis-vahemälu ja kehtetuks muutmist.'
  },

  websocket: {
    symptom: 'server A ei näe server B teateid',
    fix: 'Kasuta Redis Pub/Sub-i või muud ühist sõnumivahendajat.'
  },

  counter: {
    symptom: 'statistika on eksemplaride arvu võrra vale',
    fix: 'Kasuta ühiseid atomaarseid loendureid Redis-es või andmebaasis.'
  },

  scheduled_job: {
    symptom: 'kaks kirja ühe ostu kohta',
    fix: 'Kasuta jagatud tööjärjekorda ja idempotentsusvõtit.'
  },

  uploaded_file: {
    symptom: '404 iga teise päringu peale',
    fix: 'Salvesta failid ühisesse objektihoidlasse.'
  }
};

// 2. Leiame rakenduses ühe eksemplari mälust sõltuvad osad.
export function findProblems(app = {}) {
  const problems = [];

  for (const [name, location] of Object.entries(app)) {
    if (
      location === 'in-memory' &&
      Object.hasOwn(IN_MEMORY_STATE, name)
    ) {
      problems.push({
        name,
        symptom: IN_MEMORY_STATE[name].symptom,
        fix: IN_MEMORY_STATE[name].fix
      });
    }
  }

  return problems;
}

// 3. Kolme ühise hoidla eelised ja puudused.
export const STORES = {
  redis: {
    pros: 'Kiire ligipääs, ühine olek ja sisseehitatud TTL.',
    cons: 'Üks lisateenus, mis võib maas olla; vaja on töökindlust.'
  },

  database: {
    pros: 'Püsivad andmed, tehingud ja usaldusväärne salvestamine.',
    cons: 'Andmebaasi koormatakse iga päringuga ning ligipääs võib olla aeglasem.'
  },

  object_store: {
    pros: 'Kõik serverieksemplarid näevad SAMA faili ja faile saab hoida eraldi.',
    cons: 'Väikese muutuva oleku jaoks ebasobiv: iga kirjutus saadab terve objekt uuesti.'
  }
};
