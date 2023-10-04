import domMapping from './domMapping.js';

export class Slider extends HTMLElement {
    constructor(parent, options) {
        super();
        this.parent = parent;
        this.options = options;
        this.isDragging = false;
        this.init();
    }

    addLineToDisplay(svgElement, x, y, angle, className) {
        const arrowElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        arrowElement.setAttribute('x1', x);
        arrowElement.setAttribute('y1', y);
        arrowElement.setAttribute('x2', x + 20 * Math.cos(angle));  // 20 ist die Länge der Linie
        arrowElement.setAttribute('y2', y + 20 * Math.sin(angle));  // 20 ist die Länge der Linie
        arrowElement.setAttribute('class', className);
        arrowElement.setAttribute('stroke', 'black');
        arrowElement.setAttribute('stroke-width', '22');
        arrowElement.setAttribute('z-index', '22222');
        svgElement.appendChild(arrowElement);
    }

    init() {
        this.sliderContainer = domMapping.createElementDynamical(this.parent, 'div', this.options.containerClass);
        this.sliderObject = domMapping.createElementDynamical(this.sliderContainer, 'object', this.options.containerClass + '-iframe');
        this.sliderObject.data = 'assets/others/base1412207692.svg';
        this.sliderObject.height = '70px';
        this.sliderObject.width = '70px';
        this.sliderLabel = domMapping.createElementDynamical(this.sliderObject, 'label', 'sliderLabel', this.options.labelText);
        this.sliderLabel.text = this.options.sliderId;
        let isDragging = false;

        this.sliderObject.addEventListener('load', () => {
            const svgDoc = this.sliderObject.contentDocument;
            const svgRoot = svgDoc.documentElement;
            const circleElement = svgRoot.querySelector("#circle61");

            const Cx = parseFloat(circleElement.getAttribute('cx'));
            const Cy = parseFloat(circleElement.getAttribute('cy'));
            const R = 7500;  // Radius, an dem die Linien und Pfeile positioniert werden sollen

            const optionsMax = this.options.max;
            const startTheta = 225 * Math.PI / 180;
            const endTheta = 310 * Math.PI / 180;

            for (let i = 0; i < optionsMax; i++) {
                const ratio = i / (optionsMax - 1);
                const theta = startTheta + ratio * (endTheta - startTheta);

                const x1 = Cx + R * Math.cos(theta);
                const y1 = Cy + R * Math.sin(theta);

                const x2 = Cx + (R + 200) * Math.cos(theta);
                const y2 = Cy + (R + 200) * Math.sin(theta);

                const lineElement = document.createElementNS("http://www.w3.org/2000/svg", "line");
                lineElement.setAttribute("x1", `${x1}`);
                lineElement.setAttribute("y1", `${y1}`);
                lineElement.setAttribute("x2", `${x2}`);
                lineElement.setAttribute("y2", `${y2}`);
                lineElement.setAttribute("class", "fil0 str2");
                svgRoot.appendChild(lineElement);
            }

            let initialTheta, currentTheta;

            svgRoot.addEventListener('mousedown', function (e) {
                const point = svgRoot.createSVGPoint();
                point.x = e.clientX;
                point.y = e.clientY;

                const ctm = svgRoot.getScreenCTM();
                const inverseCTM = ctm.inverse();

                const localPoint = point.matrixTransform(inverseCTM);

                const dx = localPoint.x - Cx;
                const dy = localPoint.y - Cy;

                initialTheta = Math.atan2(dy, dx);
                isDragging = true;
            });
            const self = this;
            let lastUpdate = Date.now();
            const delay = 2000 / this.options.max;
            svgRoot.addEventListener('mousemove', function (e) {
                const now = Date.now();
                if (now - lastUpdate >= delay) {
                    lastUpdate = now;
                    if (isDragging) {
                        const point = svgRoot.createSVGPoint();
                        point.x = e.clientX;
                        point.y = e.clientY;

                        const ctm = svgRoot.getScreenCTM();
                        const inverseCTM = ctm.inverse();

                        const localPoint = point.matrixTransform(inverseCTM);

                        const dx = localPoint.x - Cx;
                        const dy = localPoint.y - Cy;

                        currentTheta = Math.atan2(dy, dx);
                        currentTheta = Math.atan2(dy, dx);

                        // Winkeländerung in Grad
                        let deltaTheta = ((currentTheta - initialTheta) * 180 / Math.PI + 360) % 360;

                        // Diskrete Schritte
                        const step = 360 / self.options.max;
                        const roundedDeltaTheta = Math.round(deltaTheta / step) * step;

                        // Maximaler Drehwinkel
                        const maxTheta = 360 - step;
                        const constrainedTheta = Math.min(maxTheta, Math.max(0, roundedDeltaTheta));

                        // SVG-Element drehen
                        const markerElement = svgRoot.querySelector("#marker25_1");
                        markerElement.setAttribute("transform", `rotate(${-constrainedTheta},${Cx},${Cy})`);

                        // Anfangswinkel für die nächste Iteration setzen
                        initialTheta = currentTheta;
                    }
                }
            });
            svgRoot.addEventListener('mouseup', function (e) {
                isDragging = false;
            });
        });
    }
}

customElements.define('my-slider', Slider);