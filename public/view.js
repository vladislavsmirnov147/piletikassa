
import { draw } from './draw.js';

const state = {
  events: [],
  sort: 'name',
  dir: 'asc',
  search: '',
  loading: false
};

export const forView = (currentState) => {
  const query = String(currentState.search ?? '').toLowerCase().trim();

  const rows = currentState.events
    .filter((event) => {
      const name = String(event.name ?? '').toLowerCase();
      const venue = String(event.venue ?? '').toLowerCase();

      return name.includes(query) || venue.includes(query);
    })
    .map((event) => ({
      ...event,
      free: Math.max(0, event.seats - event.sold)
    }))
    .sort((a, b) => {
      const field = currentState.sort;
      const first = a[field];
      const second = b[field];

      let result;

      if (typeof first === 'number' && typeof second === 'number') {
        result = first - second;
      } else {
        result = String(first ?? '').localeCompare(String(second ?? ''));
      }

      if (result === 0) {
        result = String(a.id).localeCompare(String(b.id), undefined, {
          numeric: true
        });
      }

      return currentState.dir === 'desc' ? -result : result;
    });

  return {
    rows,
    state: currentState.loading ? 'loading' : 'ready'
  };
};

export const readState = () => ({
  ...state,
  events: state.events.map((event) => ({ ...event }))
});

export const setState = (changes) => {
  Object.assign(state, changes);

  const view = forView(state);
  draw(view.rows, view.state);
};
