import {globalState} from './globalState.js';
import handles from './handles.js';

export const AnimateHeader = {
    mouseMoveTimeout: 0,
    memoryLetters: [],

    startMemoryLettersAnimation: function () {
        this.memoryLetters = Array.from(document.querySelectorAll('.memory-letter')).map((letter) => {
            const speed = Math.random() * 0.5 + 1;
            const angle = Math.random() * 2 * Math.PI;
            return {letter, speed, angle, x: 0, y: 0, inactiveTime: 0, prevX: 0, prevY: 0};
        });
        requestAnimationFrame(this.updateMemoryLettersPosition.bind(this));
    },
    updateMemoryLettersPosition: function () {
        this.memoryLetters.forEach((obj) => {
            const dx = obj.speed * Math.cos(obj.angle);
            const dy = obj.speed * Math.sin(obj.angle);
            obj.x += dx;
            obj.y += dy;

            obj.letter.style.transform = `translate(${obj.x}px, ${obj.y}px)`;

            const rect = obj.letter.getBoundingClientRect();

            // Bouncing-Effekt an den Fenstergrenzen
            if (rect.top + dy < 0 || rect.bottom + dy > window.innerHeight) {
                obj.angle = -obj.angle + 1.5 * Math.PI * Math.random() * 0.1;
            }
            if (rect.left + dx < 0 || rect.right + dx > window.innerWidth) {
                obj.angle = Math.PI - obj.angle + 2 * Math.PI * Math.random() * 0.1;
            }
        });

        requestAnimationFrame(this.updateMemoryLettersPosition.bind(this));
    },
    resetMemoryLettersPosition: function () {
        if (this.memoryLetters.length > 0) {
            this.memoryLetters.forEach((obj) => {
                obj.letter.style.transition = 'transform 0.5s';
                obj.letter.style.transform = 'translate(0px, 0px)';
                obj.x = 0;
                obj.y = 0;
            });
            this.memoryLetters = [];
        }
    },
    appendEventListeners: function (elements) {
        for (let card of elements.grid) {
            if (card) card.addEventListener('click', handles.handleClick.bind(this));
        }
        document.addEventListener('mousemove', (e) => {
            globalState.lastMousePosition.x = e.clientX;
            globalState.lastMousePosition.y = e.clientY;

            clearTimeout(this.mouseMoveTimeout);
            this.resetMemoryLettersPosition();

            this.mouseMoveTimeout = setTimeout(this.startMemoryLettersAnimation.bind(this), 5000);
        });
    }
};

export default AnimateHeader;

