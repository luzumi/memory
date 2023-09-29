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
        this.setSlider = null;
        this.cardCount = null;
    }

    initialize() {
        this.menuDiv = document.querySelector('#menu-container');
        this.menuButton = domMapping.createElementDynamical(this.menuDiv, 'div', 'menu-button', '☰');
        this.menuContent = domMapping.createElementDynamical(this.menuDiv, 'div', 'menu-content');

        this.cardSlider = this.createSlider(
            this.menuContent,
            'slider-container',
            'Anzahl der Karten:',
            'cardSlider',
            2, 16, 2,
            globalState.gridSize,
            'cardCount',
            value => { globalState.gridSize = value; }
        );

        this.setSlider = this.createSlider(
            this.menuContent,
            'slider-container',
            'Set',
            'setSlider',
            1,
            4,
            1,
            globalState.setId,
            'setCount',
            value => { globalState.setId = value; }
        );


        this.restartButton = domMapping.createElementDynamical(this.menuDiv, 'button', 'restart-button', 'Neustart');

        this.addEventListeners();
    }
    resetGame() {
        // Leere das Spielfeld
        const playground = document.querySelector('.Playground');
        while (playground.firstChild) {
            playground.removeChild(playground.firstChild);
        }

        // Setze die Spielvariablen zurück
        globalState.clickedImage = [];
        globalState.score = 0;
        // Weitere Variablen...

        // Erstelle das Spielfeld neu
        domMapping.createGrid();
    }

    createSlider(parent, containerClass, labelText, sliderId, min, max, step, value, valueDisplayId, callback) {
        const sliderContainer = domMapping.createElementDynamical(parent, 'div', containerClass);
        const sliderLabel = domMapping.createElementDynamical(sliderContainer, 'label', 'sliderLabel', labelText);
        sliderLabel.for = sliderId;

        const cardSlider = domMapping.createElementDynamical(sliderContainer, 'input');
        cardSlider.type = 'range';
        cardSlider.id = sliderId;
        cardSlider.min = min;
        cardSlider.max = max;
        cardSlider.step = step;
        cardSlider.value = value;

        const valueDisplay = domMapping.createElementDynamical(sliderContainer, 'span', null, value.toString());
        valueDisplay.id = valueDisplayId;
//TODO Sliderwert instant anzeigen
        if (callback) {
            cardSlider.addEventListener('input', () => {
                const newValue = cardSlider.value;
                callback(parseInt(newValue, 10));
            });
        }

        return cardSlider;
    }


    addSliderEventListeners(slider, callback) {
        slider.addEventListener('input', () => {
            const value = slider.value;
            callback(value); // Aktualisiere globalState entsprechend
        });
    }

    addEventListeners() {
        this.menuButton.addEventListener('click', () => {
            this.menuContent.style.display = this.menuContent.style.display === 'none' ? 'block' : 'none';
        });

        this.cardSlider.addEventListener('input', () => {
            const value = this.cardSlider.value;
            this.cardCount.innerHTML = value;
            // Aktualisiere globalState.gridSize
            globalState.gridSize = parseInt(value, 10);
        });
        this.restartButton.addEventListener('click', () => {
            this.resetGame(); // Rufe die Methode zum Zurücksetzen des Spiels auf
        });
    }
};
