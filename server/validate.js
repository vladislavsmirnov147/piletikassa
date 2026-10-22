
import { z } from 'zod';

import { SORTABLE, FILTERABLE, readPage } from './query.js';

import {
  ServiceError,
  KIND_TO_CODE
} from './layers.js';

export { zodFields } from './zod-fields.js';
export { validate } from './validate-middleware.js';

// 1. Tellimuse skeem.
// Tundmatud väljad on keelatud.
// Kehas ei teisendata sõnesid automaatselt arvudeks.
export const OrderSchema = z.object({
  event: z.number().int().positive(),
  qty: z.number().int().min(1).max(10),
  buyer: z.string().trim().min(2),
  email: z.email()
}).strict();

// 2. Sündmuse muudatus.
// Vähemalt üks väli peab olema antud.
export const EventChange = z.object({
  name: z.string().trim().min(1).optional(),
  venue: z.string().trim().min(1).optional(),
  start: z.string().min(1).optional(),
  price: z.number().nonnegative().optional(),
  seats: z.number().int().nonnegative().optional(),
  sold: z.number().int().nonnegative().optional()
}).strict().refine(
  (value) => Object.keys(value).length > 0,
  { message: 'Vähemalt üks väli on nõutud' }
);

// 3. Päringustringi valideerimine.
// Sama lehekülgede poliitika nagu C07 Ex3.
// Vigane page või per kasutab vaikeväärtust.
const pageField = (field) =>
  z.any().optional().transform(
    (value) => readPage({ [field]: value })[field]
  );

// Vigane filter annab vea.
// Filtri vaikne eemaldamine muudaks tulemuse valeks.
const numericFilter = z.coerce.number()
  .finite()
  .nonnegative()
  .optional();

// Lubatud sortimisväljad tulevad Ex3-st.
// Miinusmärk tähendab kahanevat järjestust.
const sortField = z.string().refine(
  (value) => {
    const field = value.startsWith('-')
      ? value.slice(1)
      : value;

    return SORTABLE.includes(field);
  },
  {
    message: `lubatud: ${SORTABLE.join(', ')}`
  }
).optional();

const queryFields = {
  page: pageField('page'),
  per: pageField('per'),
  search: z.string().optional(),
  sort: sortField
};

// Filtrid tulevad Ex3 lubatud väärtuste loendist.
for (const field of FILTERABLE) {
  queryFields[field] =
    field === 'venue'
      ? z.string().optional()
      : numericFilter;
}

// Tundmatud päringuparameetrid eemaldatakse.
export const ListQuery = z.object(queryFields).strip();

// 4. Ühtne veakuju.
// err on inimesele.
// code on masinale.
// fields on vormile.
export function errorShape(code, err, options = {}) {
  const result = { err, code };

  if (
    options.fields &&
    Object.keys(options.fields).length > 0
  ) {
    result.fields = options.fields;
  }

  if (options.detail !== undefined) {
    result.detail = options.detail;
  }

  return result;
}

// 5. Veakoodid ja HTTP-staatused.
export const ERROR_CODES = {
  INVALID_INPUT: 422,
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  CONFLICT: 409,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401
};

// 6. Teenuse vigade ühtne käsitlemine.
// Teenuse vealiik teisendatakse masinloetavaks koodiks.
// Tundmatud programmeerimisvead antakse edasi.
export function serviceErrorHandler() {
  return (error, req, res, next) => {
    if (!(error instanceof ServiceError)) {
      return next(error);
    }

    const code = KIND_TO_CODE[error.kind];
    const status = ERROR_CODES[code] ?? 500;

    return res.status(status).json(
      errorShape(code, error.message, {
        detail: error.detail
      })
    );
  };
}

// 7. Teksti puhastamine.
// Eemaldame juhtmärgid, kuid säilitame
// HTML-märgid ja reavahetused.
// XSS-kaitse peab toimuma väljundis.
export function cleanText(value) {
  return String(value)
    .replace(/\r\n?/g, '\n')
    .replace(/[\x00-\x09\x0B-\x1F\x7F]/g, '')
    .trim();
}
