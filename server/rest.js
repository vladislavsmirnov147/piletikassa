
import {
  applyPut,
  applyPatch,
  inputCode,
  wrongMethod
} from './rest-mechanics.js';

// Õpetaja antud REST-mehaanika.
// Neid funktsioone ei kirjuta me ümber.
export {
  applyPut,
  applyPatch,
  inputCode,
  wrongMethod
};

// URL nimetab ressurssi, mitte tegevust.
// Kollektsioonid on mitmuses.
export const ROUTES = {
  events: '/api/events',
  event: (id) => `/api/events/${id}`,
  seatmap: (id) => `/api/events/${id}/seatmap`,

  orders: '/api/orders',
  order: (id) => `/api/orders/${id}`,
  cancellation: (id) => `/api/orders/${id}/cancellation`
};

// Lubatud HTTP-meetodid iga ressursi jaoks.
// Saaliplaan on loetav, kuid seda ei muudeta otse.
export const ALLOWED = {
  events: ['GET', 'POST'],
  event: ['GET', 'PUT', 'PATCH', 'DELETE'],
  seatmap: ['GET'],

  orders: ['GET', 'POST'],
  order: ['GET'],
  cancellation: ['GET', 'POST']
};

// Igal veal on kindel tähendus.
// 400 = vigane JSON, 422 = vigased väärtused,
// 409 = vastuolu olemasoleva olekuga.
export const STATUS = {
  brokenJson: 400,
  negativeCount: 422,
  unknownEventInOrder: 422,
  eventGone: 404,
  seatTaken: 409,
  tooManyTickets: 409,
  cancelledTwice: 409,
  noLogin: 401,
  notOrganizer: 403
};

// API versioon on URL-is.
// /api/events -> /api/v1/events
export function versioned(path, version = 'v1') {
  return path.replace(/^\/api(?=\/|$)/, `/api/${version}`);
}
