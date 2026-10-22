
import { Router } from 'express';
import { wrap } from '../materials/express-helpers.js';

// Sündmuste marsruudid: /api/events
export function eventsRouter(store) {
  const router = Router();

  // Kõigepealt konkreetne tee /popular.
  router.get('/popular', wrap(async (req, res) => {
    const events = await store.events();
    res.json(events.filter((event) => event.sold >= event.seats));
  }));

  // Kõigi sündmuste nimekiri ja otsing.
  router.get('/', wrap(async (req, res) => {
    const events = await store.events(req.query.search || '');
    res.json(events);
  }));

  // Üks sündmus ID järgi.
  router.get('/:id', wrap(async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ err: 'Vigane ID' });
    }

    const event = await store.event(id);

    if (!event) {
      return res.status(404).json({ err: 'Sündmust ei leitud' });
    }

    return res.json(event);
  }));

  // Sündmuse andmete muutmine.
  router.patch('/:id', wrap(async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ err: 'Vigane ID' });
    }

    const event = await store.updateEvent(id, req.body || {});

    if (!event) {
      return res.status(404).json({ err: 'Sündmust ei leitud' });
    }

    return res.json(event);
  }));

  return router;
}

// Tellimuste marsruudid: /api/orders
export function ordersRouter(store) {
  const router = Router();

  router.post('/', wrap(async (req, res) => {
    const { event, qty } = req.body || {};

    if (
      !Number.isInteger(event) ||
      !Number.isInteger(qty) ||
      qty < 1
    ) {
      return res.status(422).json({ err: 'Vigased väljad' });
    }

    const selectedEvent = await store.event(event);

    if (!selectedEvent) {
      return res.status(422).json({ err: 'Sündmust ei leitud' });
    }

    if (selectedEvent.sold + qty > selectedEvent.seats) {
      return res.status(409).json({ err: 'Kohti ei jätku' });
    }

    const order = await store.addOrder({ event, qty });

    return res
      .status(201)
      .location(`/api/orders/${order.id}`)
      .json(order);
  }));

  router.delete('/:id', wrap(async (req, res) => {
    const id = Number(req.params.id);
    const deleted = await store.removeOrder(id);

    if (!deleted) {
      return res.status(404).json({ err: 'Tellimust ei leitud' });
    }

    return res.status(204).end();
  }));

  return router;
}
