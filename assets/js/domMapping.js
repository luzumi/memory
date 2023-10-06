// Importiere Abhängigkeiten
import {globalState} from './globalState.js';
import Menu from './menu.js';
import {DOM_METHOD} from './DOM_METHOD.js';
import imagePool from './imagePool.js';

export const domMapping = {
    imageHeight: 0,  // Initialisiere die Bildhöhe

    // Initialisiere das DOM
    init() {
        this.setupUIComponents();
    },

    // Rufe alle UI-Erstellungsfunktionen auf
    setupUIComponents() {
        this.createBody();
        this.createHeader();
        this.createGrid();
        this.createMenu();
    },

    // Erstelle den Body und setze das Hintergrundbild
    createBody() {
        const {elements, getBackgrounds} = globalState;
        elements.body = document.querySelector('body');
        elements.body.style.backgroundImage = `url(${getBackgrounds()}wallpaper.png)`;
    },

    // Erstelle den Header
    createHeader(){
        const {elements, getImgHeader} = globalState;
        elements.header = document.querySelector('#header');

        Array.from({length: 6}, (_, index) => {
            const div = this.createElementDynamical(elements.header, 'div', 'memory-letter');
            const img = this.createElementDynamical(div, 'img');
            img.src = `${getImgHeader()}${index}.png`;
            img.height = this.imageHeight;
            img.width = this.imageHeight ?? 150;
            img.alt = ("memory"[index]).toUpperCase();
        });
    },


    // Fülle das Spielfeld mit Karten
    createGrid() {
        // Zugriff auf globale Variablen und initialisiere das Spielfeld
        const { elements, gridSize } = globalState;
        elements.playground = document.querySelector('.Playground');
        elements.grid = [];

        // Setze die maximale Größe des Spielfelds und initialisiere ein Array dafür
        const maxGridSize = 16;
        const gridArray = new Array(maxGridSize).fill(null);
        const shuffledImages = this.shuffleImages(); // Hole zufällig gemischte Bilder
        const color = 'transparent'; // Farbe für Platzhalter

        // Markiere im Array die Positionen, die als Platzhalter dienen sollen
        for (let i = 0; i < maxGridSize; i++) {
            if (this.shouldSkipPosition(i, gridSize)) {
                gridArray[i] = color;
            }
        }

        // Fülle die restlichen Positionen im Array mit den Bildern
        let imageIndex = 0;
        for (let i = 0; i < maxGridSize; i++) {
            if (gridArray[i] === null && imageIndex < gridSize) {
                gridArray[i] = shuffledImages[imageIndex];
                imageIndex++; // Erhöhe den Bildindex für die nächste Runde
            }
        }

        // Erstelle die DOM-Elemente für das Spielfeld basierend auf dem Array
        for (let i = 0; i < maxGridSize; i++) {
            if (gridArray[i] === color) {
                // Erstelle einen Platzhalter und füge ihn zum Spielfeld hinzu
                const div = this.createElementDynamical(elements.playground, 'div', 'free');
                div.style.width = `${this.imageHeight}px`;
                div.style.height = `${this.imageHeight}px`;
                div.style.backgroundColor = color;
                elements.grid.push(div);
            } else if (gridArray[i] !== null) {
                // Erstelle eine Karte und füge sie zum Spielfeld hinzu
                const div = this.createElementDynamical(elements.playground, 'div', 'card');
                const img = this.createElementDynamical(div, 'img');
                img.id = i;
                img.src = `${globalState.getBackgrounds()}backside.png`;
                img.dataset.frontSrc = gridArray[i];
                img.width = 150;
                this.imageHeight = img.offsetWidth ?? 150; // Setze die Höhe des Bildes
                elements.grid.push(div);
            }
        }
    },


    // Erstelle das Menü
    createMenu() {
        const menu = new Menu();
        menu.initialize();
    },


    shuffleImages: function () {
        globalState.images = imagePool.createImagePool(globalState.setId);
        const shuffledImages = [...globalState.images];
        imagePool.shuffleArray(shuffledImages);

        const selectedImages = shuffledImages.slice(0, globalState.gridSize / 2);
        const imagePairs = [...selectedImages, ...selectedImages];

        imagePool.shuffleArray(imagePairs);

        return imagePairs;
    },


    createElementDynamical: function (element, tag, className = null, content = null, method = DOM_METHOD.APPEND_CHILD) {
        const newElement = document.createElement(tag);
        if (className) newElement.className = className;
        if (content) newElement.innerText = content;

        if (element) {
            switch (method) {
                case DOM_METHOD.APPEND_CHILD:
                    element.appendChild(newElement);
                    break;
                case DOM_METHOD.PREPEND:
                    element.prepend(newElement);
                    break;
                case DOM_METHOD.AFTER:
                    element.after(newElement);
                    break;
                case DOM_METHOD.BEFORE:
                    element.before(newElement);
                    break;
                case DOM_METHOD.INSERT_BEFORE:
                    element.insertBefore(newElement);
                    break;
                case DOM_METHOD.REPLACE_WITH:
                    element.replaceWith(newElement);
                    break;
                default:
                    console.warn("Unsupported DOM method");
            }
            return newElement;
        }
        return null;
    },


    shouldSkipPosition: function (index, gridSize) {
        const skipPositions = {
            14: [5, 10],
            12: [0, 3, 12, 15],
            10: [0, 5, 6, 8, 9, 15],
            8: [1,3,6,8,9,11,13,15],
            6: [10, 11, 12, 13, 14, 15],
            4: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            2: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        };

        return skipPositions[gridSize]?.includes(index) || false;
    }

};

export default domMapping;
