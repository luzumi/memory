import {globalState} from "./globalState.js";

const imagePool = {
    shuffleArray: function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    createImagePool: function() {
        const images = [];
        for (let index = 0; index < 15; index++) {
            images.push(`img/set${ globalState.setId }/${index}.png`);
        }
        return images;
    }
};

export default imagePool;