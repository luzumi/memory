import {domMapping} from "./domMapping.js";
import {globalState} from "./globalState.js";

export default class Menu {
    constructor() {
        this.menuDiv = null;
        this.menuButton = null;
        this.menuContent = null;
        this.sliderContainer = null;
        this.sliderLabel = null;
        this.cardSlider = null;
        this.cardCount = null;
    }

    initialize() {
        this.menuDiv = document.querySelector('.playground-container');
        this.menuButton = domMapping.createElementDynamical(this.menuDiv, 'div', 'menu-button', '☰');
        this.menuContent = domMapping.createElementDynamical(this.menuDiv, 'div', 'menu-content');

        this.sliderContainer = domMapping.createElementDynamical(this.menuContent, 'div', 'slider-container');
        this.sliderLabel = domMapping.createElementDynamical(this.sliderContainer, 'label', 'sliderLabel', 'Anzahl der Karten:');
        this.sliderLabel.for = 'cardSlider';

        this.cardSlider = domMapping.createElementDynamical(this.sliderContainer, 'input');
        this.cardSlider.type = 'range';
        this.cardSlider.id = 'cardSlider';
        this.cardSlider.min = '2';
        this.cardSlider.max = '16';
        this.cardSlider.step = '2';
        this.cardSlider.value = '2';

        this.cardCount = domMapping.createElementDynamical(this.sliderContainer, 'span', null, '2');
        this.cardCount.id = 'cardCount';

        this.addEventListeners();
    }
    addEventListeners() {
        this.menuButton.addEventListener('click', () => {
            this.menuContent.style.display = this.menuContent.style.display === 'none' ? 'block' : 'none';
        });

        this.cardSlider.addEventListener('input', () => {
            const value = this.cardSlider.value;
            this.cardCount.innerHTML = value;
            // Aktualisiere globalState.gridSize oder führe andere Aktionen aus
            globalState.gridSize = parseInt(value, 10);
        });
    }
};
