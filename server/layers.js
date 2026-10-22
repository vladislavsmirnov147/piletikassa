
import {
  ServiceError,
  KIND_TO_CODE,
  serviceErrorHandler
} from './service-errors.js';

import { canEdit } from './permissions.js';

// Etteantud veaklass ja HTTP-veakäsitleja.
export {
  ServiceError,
  KIND_TO_CODE,
  serviceErrorHandler
};

// Teenus saab repositooriumi ja kella parameetritena.
// Teenus ei kasuta Expressi ega HTTP olekukoode.
export function createEventService(store, { now = () => new Date() } = {}) {
  async function findEvent(id) {
    const event = await store.findById(Number(id));

    if (!event) {
      throw new ServiceError('not_found', 'Sündmust ei leitud.');
    }

    return event;
  }

  return {
    // Sündmuste nimekiri ja otsing.
    async list(options = {}) {
      return store.findAll(options);
    },

    // Ühe sündmuse lugemine.
    async one(id) {
      return findEvent(id);
    },

    // Piletite ostmine.
    async buy(id, qty) {
      const event = await findEvent(id);

      // Piletite arv peab olema positiivne täisarv.
      if (!Number.isInteger(qty) || qty <= 0) {
        throw new ServiceError(
          'invalid',
          'Piletite arv peab olema positiivne täisarv.'
        );
      }

      // Kõigepealt kontrollime vabade kohtade arvu.
      if (event.seats - event.sold < qty) {
        throw new ServiceError(
          'conflict',
          'Vabu kohti ei jätku.'
        );
      }

      // Võrdleme sündmuse algust etteantud kellaga.
      // Testides saab kella asendada kindla kuupäevaga.
      const startTime = new Date(event.start).getTime();
      const currentTime = now().getTime();

      if (startTime <= currentTime) {
        throw new ServiceError(
          'conflict',
          'Sündmus on juba alanud.'
        );
      }

      // Repositooriumi poole pöördume ainult ühe korra.
      return store.addOrder({
        event: event.id,
        qty
      });
    },

    // Sündmuse muutmine.
    async update(id, change, user) {
      // Kasutaja puudumine ja õiguste puudumine
      // on kaks erinevat ärireegli viga.
      if (!user) {
        throw new ServiceError(
          'unauthenticated',
          'Kasutaja ei ole sisse logitud.'
        );
      }

      if (!canEdit(user)) {
        throw new ServiceError(
          'forbidden',
          'Sündmuse muutmiseks puudub õigus.'
        );
      }

      await findEvent(id);

      return store.update(Number(id), change);
    }
  };
}

// Kontroller tõlgib HTTP-päringu teenuse kutseks.
// Ärireeglid jäävad teenusekihti.
export function createEventsController(service) {
  return {
    async list(req, res, next) {
      try {
        const events = await service.list(req.query);
        return res.json(events);
      } catch (err) {
        if (next) return next(err);
        throw err;
      }
    },

    async one(req, res, next) {
      try {
        const event = await service.one(req.params.id);
        return res.json(event);
      } catch (err) {
        if (next) return next(err);
        throw err;
      }
    },

    async buy(req, res, next) {
      try {
        const order = await service.buy(
          req.params.id,
          req.body.qty
        );

        return res
          .status(201)
          .location(`/api/orders/${order.id}`)
          .json(order);
      } catch (err) {
        if (next) return next(err);
        throw err;
      }
    },

    async update(req, res, next) {
      try {
        const event = await service.update(
          req.params.id,
          req.body,
          req.user
        );

        return res.json(event);
      } catch (err) {
        if (next) return next(err);
        throw err;
      }
    }
  };
}
