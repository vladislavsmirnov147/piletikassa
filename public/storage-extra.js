
import { save } from './draft.js';

let timer;

export function saveLater(data, delay = 400) {
    clearTimeout(timer);
    timer = setTimeout(() => {
        timer = undefined;
        save(data);
    }, delay);
}

export function cancelSave() {
    clearTimeout(timer);
    timer = undefined;
}

const SELECTION = 'piletikassa:selection';

export function setSelection(seats) {
    try {
        sessionStorage.setItem(SELECTION, JSON.stringify(seats));
    } catch {
        return false;
    }

    return true;
}

export function readSelection() {
    try {
        return JSON.parse(sessionStorage.getItem(SELECTION) ?? '[]');
    } catch {
        return [];
    }
}
