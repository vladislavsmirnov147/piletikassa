
import {
  readPage,
  PAGE_DEFAULT,
  PAGE_MAX
} from './read-page.js';

import { apply } from './plan-apply.js';

// Õpetaja antud funktsioonid ekspordime edasi.
export {
  readPage,
  PAGE_DEFAULT,
  PAGE_MAX,
  apply
};

// Lubatud sortimisväljad.
// free on arvutatud väli: seats - sold.
export const SORTABLE = [
  'id',
  'name',
  'venue',
  'start',
  'price',
  'free'
];

// Lubatud filtrid.
export const FILTERABLE = [
  'venue',
  'min_price',
  'max_price',
  'free_at_least'
];

// Loeb sortimise ainult lubatud väärtuste hulgast.
// Miinusmärgiga sortimine on kahanev.
export function readSort(sort) {
  if (sort === undefined || sort === null || sort === '') {
    return { field: 'start', dir: 1 };
  }

  const value = String(sort);
  const descending = value.startsWith('-');
  const field = descending ? value.slice(1) : value;

  if (!SORTABLE.includes(field)) {
    const error = new Error('Vigane sortimisväli.');
    error.fields = {
      sort: `lubatud: ${SORTABLE.join(', ')}`
    };
    throw error;
  }

  return {
    field,
    dir: descending ? -1 : 1
  };
}

// Loeb ja kontrollib filtrid.
// Vigast numbrit ei tohi vaikselt ignoreerida,
// sest see muudaks päringu tulemust.
export function readFilters(query = {}) {
  const filters = {};

  if (
    query.venue !== undefined &&
    query.venue !== null &&
    String(query.venue).trim() !== ''
  ) {
    filters.venue = String(query.venue);
  }

  for (const field of [
    'min_price',
    'max_price',
    'free_at_least'
  ]) {
    const raw = query[field];

    if (raw === undefined || raw === null || raw === '') {
      continue;
    }

    const value = Number(raw);

    if (!Number.isFinite(value) || value < 0) {
      const error = new Error('Vigane filtri väärtus.');
      error.fields = {
        [field]: 'peab olema mittenegatiivne arv'
      };
      throw error;
    }

    filters[field] = value;
  }

  return filters;
}

// Plaan kirjeldab päringut, mitte andmebaasi.
// Sama plaani saab hiljem kasutada SQL-iga.
export function createPlan(query = {}) {
  const page = readPage(query);

  const search =
    typeof query.search === 'string'
      ? query.search.trim()
      : '';

  return {
    search,
    filters: readFilters(query),
    sort: readSort(query.sort),
    page: page.page,
    per: page.per,
    offset: page.offset
  };
}
