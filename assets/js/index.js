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