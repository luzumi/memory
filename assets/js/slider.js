import domMapping from './domMapping.js';

export class Slider extends HTMLElement {
    constructor(parent, options) {
        super();
        this.parent = parent;
        this.options = options;
        this.init();
    }

    addLineToDisplay(svgElement, x, y, angle, className) {
        const arrowElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        arrowElement.setAttribute('x1', x);
        arrowElement.setAttribute('y1', y);
        arrowElement.setAttribute('x2', x + 20 * Math.cos(angle));
        arrowElement.setAttribute('y2', y + 20 * Math.sin(angle));
        arrowElement.setAttribute('class', className);
        arrowElement.setAttribute('stroke', 'black');
        arrowElement.setAttribute('stroke-width', '22');
        arrowElement.setAttribute('z-index', '22222');
        svgElement.appendChild(arrowElement);
    }

    handleMouseDown(e, svgRoot, Cx, Cy, anglePerSector, optionsMax) {
        const point = svgRoot.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;

        const ctm = svgRoot.getScreenCTM();
        const inverseCTM = ctm.inverse();

        const localPoint = point.matrixTransform(inverseCTM);

        const dx = localPoint.x - Cx;
        const dy = localPoint.y - Cy;

        let angle = Math.atan2(dy, dx);
        // Rekalibrieren des Winkels, sodass 0° auf der unteren Seite des Kreises liegt
        let angleDeg = (angle * 180 / Math.PI + 270) % 360;

        // Korrektur des Winkels, falls er außerhalb des gewünschten Bereichs liegt
        if (angleDeg < 0) {
            angleDeg += 360;
        }

        const selectedSector = Math.floor(angleDeg / anglePerSector);
        const selectedValue = (Math.floor(angleDeg / anglePerSector) * this.options.step) % optionsMax;  // Verwende `this.options.step`


        // Marker drehen
        const step = 360 / this.options.max;
        const roundedDeltaTheta = Math.round(angleDeg / step) * step;
        const maxTheta = 360 - step;
        const constrainedTheta = Math.min(maxTheta, Math.max(0, roundedDeltaTheta));
        const markerElement = svgRoot.querySelector("#marker25_1");
        // Beachten Sie die Subtraktion von 360 Grad, um die Drehrichtung zu korrigieren
        markerElement.setAttribute("transform", `rotate(${constrainedTheta - 450},${Cx},${Cy})`);


        console.log(e, selectedValue + 1, selectedSector + 1);
    }

    init() {
        this.sliderContainer = domMapping.createElementDynamical(this.parent, 'div', this.options.containerClass);
        this.sliderObject = domMapping.createElementDynamical(this.sliderContainer, 'object', `${this.options.containerClass}-iframe`);
        this.sliderObject.data = 'assets/others/base1412207692.svg';
        this.sliderObject.height = '70px';
        this.sliderObject.width = '70px';
        this.sliderLabel = domMapping.createElementDynamical(this.sliderObject, 'label', 'sliderLabel', this.options.labelText);
        this.sliderLabel.text = this.options.sliderId;

        this.sliderObject.addEventListener('load', () => {
            const svgDoc = this.sliderObject.contentDocument;
            const svgRoot = svgDoc.documentElement;
            const circleElement = svgRoot.querySelector("#circle61");
            const Cx = parseFloat(circleElement.getAttribute('cx'));
            const Cy = parseFloat(circleElement.getAttribute('cy'));
            const optionsMax = this.options.max;
            const anglePerSector = 360 / (optionsMax / this.options.step);

            svgRoot.addEventListener('mousedown', (e) => {
                this.handleMouseDown(e, svgRoot, Cx, Cy, anglePerSector, optionsMax);
            });

            svgRoot.addEventListener('mouseup', function (e) {
                this.isDragging = false;
            });
        });
    }
}

customElements.define('my-slider', Slider);
