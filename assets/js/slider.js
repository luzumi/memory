import domMapping from './domMapping.js';
import {globalState} from "./globalState.js";

export class Slider extends HTMLElement {
    constructor(parent, options) {
        super();
        this.parent = parent;
        this.options = options;
        this.init();
    }

    init() {
        this.sliderContainer = domMapping.createElementDynamical(this.parent, 'div', this.options.containerClass);

        this.sliderLabel = domMapping.createElementDynamical(this.sliderContainer, 'label', 'sliderLabel', this.options.labelText);
        this.sliderLabel.for = this.options.sliderId;

        this.valueDisplay = domMapping.createElementDynamical(this.sliderContainer, 'span', 'digital-display', this.options.value.toString());
        this.valueDisplay.id = 'digital-display-' + this.options.sliderId;

        this.sliderInput = domMapping.createElementDynamical(this.sliderContainer, 'input');
        this.sliderInput.type = 'range';
        this.sliderInput.id = this.options.sliderId;
        this.sliderInput.min = this.options.min;
        this.sliderInput.max = this.options.max;
        this.sliderInput.step = this.options.step;
        this.sliderInput.value = this.options.value;

        if (this.options.callback) {
            this.sliderInput.addEventListener('input', () => {
                const newValue = this.sliderInput.value;
                this.valueDisplay.innerHTML = newValue; // Aktualisiere das digitale Display
                this.options.callback(parseInt(newValue, 10));
            });
        }

        this.sliderInput.addEventListener('input', () => {
            const value = this.sliderInput.value;

            globalState[this.options.value] = parseInt(value, 10);
        });
    }
}

customElements.define('my-slider', Slider);