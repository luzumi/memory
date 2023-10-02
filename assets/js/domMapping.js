// ... (existing code)
import {globalState} from './globalState.js';
import Menu from "./menu.js";
import {DOM_METHOD} from "./DOM_METHOD.js";
import imagePool from "./imagePool.js";

export const domMapping = {
    imageHeight: 0,
    init: function () {
        this.createBody();
        this.createGrid();
        this.createHeader();
        this.createMenu()

    },
    createBody: function () {
        globalState.elements.body = document.querySelector('body');
        globalState.elements.body.style.backgroundImage = `url(${globalState.getBackgrounds()}wallpaper.png)`;
    },
    createHeader: function () {
        globalState.elements.header = document.querySelector('#header');
        for (let index = 0; index < 6; index++) {
            const div = this.createElementDynamical(globalState.elements.header, 'div', 'memory-letter');
            const img = this.createElementDynamical(div, 'img', );

            if (img) {
                img.src = `${globalState.getImgHeader()}${index}.png`;
                img.height = this.imageHeight;
                img.width = this.imageHeight??150;
                img.alt = ("memory"[index]).toUpperCase();
            }
        }
    },
    createGrid: function () {
        globalState.elements.playground = document.querySelector('.Playground');
        globalState.elements.grid = [];

        const shuffledImages = this.shuffleImages();

        for (let i = 0; i < globalState.gridSize; i++) {
            if(this.shouldSkipPosition(i, globalState.gridSize)) {
                const div = this.createElementDynamical(globalState.elements.playground, 'div', 'free', null, DOM_METHOD.APPEND_CHILD);

                globalState.elements.grid.push(div);
                continue;
            }
            const div = this.createElementDynamical(globalState.elements.playground, 'div', 'card');
            const img = this.createElementDynamical(div, 'img');
            if (img) {
                img.id = i;
                img.src = `${globalState.getBackgrounds()}backside.png`;
                img.dataset.frontSrc = shuffledImages[i];
                img.width = 150;
            }
            this.imageHeight = img.offsetWidth??150;
            globalState.elements.grid.push(div);
        }
    },
    createMenu: function () {
        const menu = new Menu();  // Create a new Menu instance
        menu.initialize();  // Initialize the menu
    },
    shuffleImages: function () {
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
    shouldSkipPosition: function(index, gridSize) {
        const skipPositions = {
            14: { positions: [5, 10], gridArea: null },
            12: { positions: [0, 3, 12, 15], gridArea: null },
            10: { positions: [0, 5, 6, 8, 9, 15], gridArea: null },
            8: { positions: [4], gridArea: null },
            6: { positions: [10, 11, 12, 13, 14, 15], gridArea: null },
            4: { positions: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], gridArea: null },
            2: { positions: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], gridArea: null },
        };

        return skipPositions[gridSize]?.positions.includes(index) ? skipPositions[gridSize]?.gridArea : null;
    },

};

export default domMapping;
