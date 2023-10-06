import { globalState } from './globalState.js';
import handles from './handles.js';

export const AnimateHeader = {
    mouseMoveTimeout: 0,
    memoryLetters: [],

    // Startet die Animation für die Buchstaben des "Memory"-Headers
    startMemoryLettersAnimation() {
        this.initializeMemoryLetters();
        requestAnimationFrame(this.updateMemoryLettersPosition.bind(this));
    },

    // Initialisiert die Startposition und -geschwindigkeit der Buchstaben
    initializeMemoryLetters() {
        this.memoryLetters = Array.from(document.querySelectorAll('.memory-letter'))
            .map(letter => ({
                letter,
                speed: Math.random() * 0.5 + 1,
                angle: Math.random() * 2 * Math.PI,
                x: 0,
                y: 0
            }));
    },

    // Aktualisiert die Position der Buchstaben für die Animation
    updateMemoryLettersPosition() {
        this.memoryLetters.forEach(obj => {
            this.moveLetter(obj);
            this.checkBoundaryCollision(obj);
        });
        requestAnimationFrame(this.updateMemoryLettersPosition.bind(this));
    },

    // Bewegt einen Buchstaben basierend auf Geschwindigkeit und Winkel
    moveLetter(obj) {
        const dx = obj.speed * Math.cos(obj.angle);
        const dy = obj.speed * Math.sin(obj.angle);
        obj.x += dx;
        obj.y += dy;
        obj.letter.style.transform = `translate(${obj.x}px, ${obj.y}px)`;
    },

    // Überprüft, ob ein Buchstabe die Grenzen des Fensters erreicht hat und korrigiert den Winkel
    checkBoundaryCollision(obj) {
        const rect = obj.letter.getBoundingClientRect();
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
            obj.angle = -obj.angle + 1.5 * Math.PI * Math.random() * 0.1;
        }
        if (rect.left < 0 || rect.right > window.innerWidth) {
            obj.angle = Math.PI - obj.angle + 2 * Math.PI * Math.random() * 0.1;
        }
    },

    // Setzt die Position der Buchstaben zurück
    resetMemoryLettersPosition() {
        if (this.memoryLetters.length > 0) {
            this.memoryLetters.forEach(obj => {
                obj.letter.style.transition = 'transform 0.5s';
                obj.letter.style.transform = 'translate(0px, 0px)';
                obj.x = 0;
                obj.y = 0;
            });
            this.memoryLetters = [];
        }
    },

    // Fügt Event-Listener zu den Elementen hinzu
    appendEventListeners(elements) {
        for (let card of elements.grid) {
            if (card) card.addEventListener('click', handles.handleClick.bind(this));
        }
        this.addMouseMoveEventListener();
    },

    // Fügt einen Event-Listener für die Mausbewegung hinzu
    addMouseMoveEventListener() {
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
