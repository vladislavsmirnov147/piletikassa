
import {
  RuntimeError,
  isRuntimeError
} from '../materials/runtime-error.js';

// 404 - küsitud kirjet ei ole.
export class NotFound extends RuntimeError {
  constructor(message = 'Kirjet ei leitud', detail = null) {
    super(message, 404, detail);
    this.name = 'NotFound';
  }
}

// 422 - sisendandmed on vigased.
export class InvalidInput extends RuntimeError {
  constructor(message = 'Vigased sisendandmed', detail = null) {
    super(message, 422, detail);
    this.name = 'InvalidInput';
  }
}

// 409 - seis on vastuoluline.
export class Conflict extends RuntimeError {
  constructor(message = 'Vastuoluline seis', detail = null) {
    super(message, 409, detail);
    this.name = 'Conflict';
  }
}

// Käitusvead saavad õige HTTP-koodi.
// Programmivead annavad 500 ja nende detaile ei avaldata.
export function makeErrorResponse({ isDev = false } = {}) {
  return (err, conditions) => {
    const expected = isRuntimeError(err);

    // express.json() annab liiga suure keha korral 413.
    const tooLarge =
      err.status === 413 &&
      err.type === 'entity.too.large';

    const code = expected
      ? err.status
      : tooLarge
        ? 413
        : 500;

    const body = {
      err: expected
        ? err.message
        : tooLarge
          ? 'Päringukeha on liiga suur'
          : 'Serveri sisemine viga',
      request: conditions.requestId
    };

    if (expected && err.detail !== null) {
      body.detail = err.detail;
    }

    // Veapinu ainult arenduskeskkonnas.
    if (isDev) {
      body.stack = err.stack;
    }

    return {
      code,
      body,
      logEntry: {
        requestId: conditions.requestId,
        route: conditions.route,
        code,
        message: err.message,
        stack: err.stack
      }
    };
  };
}
