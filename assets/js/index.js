'use strict';
import ImagePool  from "./imagePool.js";
import { globalState } from './globalState.js';
import domMapping from "./domMapping.js";
import { AnimateHeader } from "./animateHeader.js";




const init = () => {
    const imagesFromPool = ImagePool.createImagePool(globalState.setId);

    if (Array.isArray(imagesFromPool)) globalState.images = imagesFromPool;
    else return;

    domMapping.init();
    AnimateHeader.appendEventListeners(globalState.elements);
}

// INIT
document.addEventListener('DOMContentLoaded', init);



// KONSTANTEN / VARIABLEN
// const elements = {};
// let gridSize = globalState.gridSize;
//
//
//
//
//
// // FUNKTIONEN
//
//
// // <img src="img/E.png" alt="E" class="memory-letter" />
// const createHeader = () => {
//     for (let index = 0; index < 6; index++) {
//         const img = document.createElement('img');
//         console.log(globalState.getImgHeader());
//         img.src = `${globalState.getImgHeader()}${index}.png`;
//         img.alt = ("memory"[index]).toUpperCase();
//         img.className = "memory-letter";
//         elements.memoryContainer.appendChild(img);
//     }
// };
// const domMapping = () => {
//     elements.body = document.querySelector('body');
//     elements.body.style.backgroundImage = `url(${globalState.getBackgrounds()}wallpaper.png)`;
//     elements.header = document.querySelector('#header');
//     elements.memoryContainer = document.querySelector('#memory-container');
//     createHeader(globalState.setId);
//     elements.memoryLetters = document.querySelectorAll('.memory-letter');
//     elements.playground = document.querySelector('.Playground');
//     elements.grid = [];
//
//
//     imagePool.shuffleArray(globalState.images);
//     const selectedImages = globalState.images.slice(0, globalState.gridSize / 2);
//     const imagePairs = [...selectedImages, ...selectedImages];
//
//     imagePool.shuffleArray(imagePairs);
//
//     for (let i = 0; i < globalState.gridSize; i++) {
//         const div = document.createElement('div');
//         div.className = 'card';
//         div.gridIndex = i;
//         const img = document.createElement('img');
//         img.id = i;
//         img.src = `${globalState.getBackgrounds()}backside.png`;
//         img.dataset.frontSrc = imagePairs[i];
//         img.width = 150;
//         div.appendChild(img);
//         elements.grid.push(div);
//         elements.playground.appendChild(div);
//     }
// };