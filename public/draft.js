
const KEY = 'piletikassa:draft';
const VERSION = 1;

export function read() {
    try {
        const stored = localStorage.getItem(KEY);

        if (stored === null) {
            return null;
        }

        const record = JSON.parse(stored);

        if (
            !record ||
            typeof record !== 'object' ||
            Array.isArray(record) ||
            record.version !== VERSION ||
            !record.data ||
            typeof record.data !== 'object' ||
            Array.isArray(record.data)
        ) {
            remove();
            return null;
        }

        return record.data;
    } catch (error) {
        return null;
    }
}

export function save(data) {
    try {
        const record = {
            version: VERSION,
            data
        };

        localStorage.setItem(KEY, JSON.stringify(record));
        return true;
    } catch (error) {
        return false;
    }
}

export function remove() {
    try {
        localStorage.removeItem(KEY);
    } catch (error) {
        return false;
    }

    return true;
}
