
export const available = (events) =>
  events.filter((event) => event.seats > event.sold);

export const list = (events) =>
  events.map((event) => ({
    ...event,
    free: event.seats - event.sold,
    occupancy: event.seats === 0
      ? 0
      : (event.sold / event.seats) * 100
  }));

export const findById = (events, id) =>
  events.find((event) => event.id === id);

export const revenue = (events) =>
  events.reduce(
    (total, event) => total + event.sold * event.price,
    0
  );

export const anyFree = (events) =>
  events.some((event) => event.seats > event.sold);

export const allSoldOut = (events) =>
  events.length > 0 &&
  events.every((event) => event.sold >= event.seats);

export const sortBy = (rows, field, dir = "asc") =>
  [...rows].sort((a, b) => {
    const first = a[field];
    const second = b[field];

    let result;

    if (typeof first === "number" && typeof second === "number") {
      result = first - second;
    } else {
      result = String(first ?? "").localeCompare(String(second ?? ""));
    }

    if (result === 0) {
      return a.id - b.id;
    }

    return dir === "desc" ? -result : result;
  });

export const summary = ({
  name: eventName,
  seats = 0,
  sold = 0,
  price = 0
} = {}) => ({
  name: eventName,
  free: seats - sold,
  revenue: sold * price
});

export const organizerName = (event) =>
  event.organizer?.name ?? "Korraldaja puudub";

export const seatsText = (event) =>
  `${event.seats ?? "?"} kohta`;

export const pack = (value) =>
  JSON.stringify(value);

export const unpack = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};
