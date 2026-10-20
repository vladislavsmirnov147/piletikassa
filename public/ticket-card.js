
import { TEMPLATE } from './card-template.js';

class TicketCard extends HTMLElement {
    static observedAttributes = ['name', 'date', 'venue', 'available', 'sold-out'];

    #shadow;
    #button;
    #seatmap;
    #handleClick;
    #loading = false;

    constructor() {
        super();

        this.#shadow = this.attachShadow({ mode: 'open' });
        this.#shadow.append(TEMPLATE.content.cloneNode(true));

        this.#button = this.#shadow.querySelector('button');

        this.#seatmap = document.createElement('div');
        this.#seatmap.className = 'seatmap';
        this.#seatmap.hidden = true;
        this.#shadow.querySelector('.card').append(this.#seatmap);

        this.#handleClick = async () => {
            if (this.#loading || this.#button.disabled) {
                return;
            }

            this.dispatchEvent(new CustomEvent('ticket-select', {
                bubbles: true,
                composed: true,
                detail: {
                    id: this.dataset.id,
                    name: this.getAttribute('name'),
                    venue: this.getAttribute('venue')
                }
            }));

            if (!this.#seatmap.hidden) {
                this.#seatmap.hidden = true;
                return;
            }

            this.#loading = true;
            this.#button.textContent = 'Laadin saaliplaani…';

            try {
                const { drawSeatmap } = await import('./seatmap.js');

                if (!this.isConnected) {
                    return;
                }

                drawSeatmap(this.#seatmap, this.dataset.id);
                this.#seatmap.hidden = false;
            } catch (error) {
                console.error('Saaliplaani laadimine ebaõnnestus:', error);
            } finally {
                this.#loading = false;
                this.#render();
            }
        };
    }

    connectedCallback() {
        this.#render();
        this.#button.addEventListener('click', this.#handleClick);
    }

    disconnectedCallback() {
        this.#button.removeEventListener('click', this.#handleClick);
    }

    attributeChangedCallback() {
        this.#render();
    }

    #render() {
        if (!this.isConnected) {
            return;
        }

        const name = this.getAttribute('name') || 'Nimeta sündmus';
        const date = this.getAttribute('date') || '';
        const venue = this.getAttribute('venue') || '';
        const available = Number(this.getAttribute('available') ?? 0);

        let nameSlot = this.querySelector('[slot="name"]');

        if (!nameSlot) {
            nameSlot = document.createElement('span');
            nameSlot.slot = 'name';
            this.append(nameSlot);
        }

        let timeSlot = this.querySelector('[slot="time"]');

        if (!timeSlot) {
            timeSlot = document.createElement('span');
            timeSlot.slot = 'time';
            this.append(timeSlot);
        }

        nameSlot.textContent = name;
        timeSlot.textContent = `${date} · ${venue}`;

        const soldOut = available <= 0;

        this.#button.disabled = soldOut;
        this.#button.textContent = soldOut
            ? 'Välja müüdud'
            : `Vali kohad (${available})`;

        if (this.hasAttribute('sold-out') !== soldOut) {
            this.toggleAttribute('sold-out', soldOut);
        }
    }
}

customElements.define('ticket-card', TicketCard);
