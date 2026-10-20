
import { setState } from './view.js';
import { read, remove } from './draft.js';
import { saveLater, cancelSave } from './storage-extra.js';

const eventsList = document.querySelector('#events');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-text');
const clearButton = document.querySelector('#clear');

eventsList.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');

    if (!button || !eventsList.contains(button)) {
        return;
    }

    const id = button.closest('[data-id]')?.dataset.id;

    if (!id) {
        return;
    }

    if (button.dataset.action === 'select') {
        console.log('Vali kohad:', id);
    }
});

const savedDraft = read();

if (savedDraft) {
    for (const element of searchForm.elements) {
        if (!element.name || !(element.name in savedDraft)) {
            continue;
        }

        if (element.type === 'checkbox') {
            element.checked = savedDraft[element.name] === element.value;
        } else if (element.type !== 'submit') {
            element.value = savedDraft[element.name];
        }
    }
}

const saveDraft = () => {
    const data = Object.fromEntries(new FormData(searchForm));
    saveLater(data);
};

searchForm.addEventListener('input', saveDraft);
searchForm.addEventListener('change', saveDraft);

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!searchForm.checkValidity()) {
        searchForm.reportValidity();
        return;
    }

    const data = Object.fromEntries(new FormData(searchForm));

    console.log('Vormi andmed:', data);

    cancelSave();
    remove();
});

let searchTimer;

searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);

    searchTimer = setTimeout(() => {
        setState({ search: searchInput.value.trim() });
    }, 250);
});

clearButton.addEventListener('click', () => {
    clearTimeout(searchTimer);
    searchInput.value = '';
    setState({ search: '' });
    searchInput.focus();
});
