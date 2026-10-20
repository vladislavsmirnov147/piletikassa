
export const freeText = (free) => {
  if (typeof free !== "number" || !Number.isFinite(free) || free < 0 || !Number.isInteger(free)) {
    return "vigane sisend";
  }

  if (free === 0) {
    return "välja müüdud";
  }

  return `${free} vaba`;
};

export const price = (tier, qty = 1, ...extras) => {
  const prices = {
    standard: 18,
    student: 12,
    vip: 35
  };

  if (!Object.hasOwn(prices, tier)) {
    throw new RangeError("Tundmatu hinnaklass");
  }

  return prices[tier] * qty + extras.reduce((sum, extra) => sum + extra, 0);
};

export const withVat = (sum) => sum * 1.24;

export const createCart = () => {
  const rows = [];

  return {
    add(item) {
      rows.push(item);
    },
    list() {
      return [...rows];
    },
    clear() {
      rows.length = 0;
    }
  };
};

export const seatLabel = (row, nr, separator = "-") => `${row}${separator}${nr}`;
