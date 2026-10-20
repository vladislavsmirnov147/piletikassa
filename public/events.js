
import { setState } from './view.js';

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

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!searchForm.checkValidity()) {
        searchForm.reportValidity();
        return;
    }

    const data = Object.fromEntries(new FormData(searchForm));

    console.log('Vormi andmed:', data);
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
