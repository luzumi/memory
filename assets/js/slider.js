import domMapping from './domMapping.js';
import {globalState} from "./globalState.js";

export class Slider extends HTMLElement {
    constructor(parent, options) {
        super();
        this.parent = parent;
        this.options = options;
        this.init();
    }

    createSliderElements() {
        this.sliderContainer = domMapping.createElementDynamical(this.parent, 'div', this.options.containerClass);

        this.sliderLabel = domMapping.createElementDynamical(
            this.sliderContainer,
            'label',
            'sliderLabel',
            this.options.labelText + this.options.value
        );
        this.sliderLabel.setAttribute('z-index', '22222222', this.options.sliderId);

        this.sliderObject = domMapping.createElementDynamical(this.sliderContainer, 'object', this.options.containerClass + '-iframe');
        this.sliderObject.data = 'assets/others/base1412207692.svg';
        this.sliderObject.height = '70px';
        this.sliderObject.width = '70px';
    }


    addLinesToSVG(svgRoot, Cx, Cy, R) {
        const startTheta = 225 * Math.PI / 180;
        const endTheta = 310 * Math.PI / 180;

        for (let i = 0; i < this.options.max; i++) {
            const ratio = i / (this.options.max - 1);
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

            const sliderKey = this.options.sliderId || 'default';
            globalState.lineCoordinates[sliderKey] = globalState.lineCoordinates[sliderKey] || [];

            globalState.lineCoordinates[sliderKey].push({
                x1, y1, x2, y2, theta
            });
        }
    }

    setArrowPosition(arrowElement, selectedValue, Cx, Cy) {
        if (!arrowElement) {
            console.error("Arrow element not found.");
            return;
        }

        // Start- und Endwinkel sowie die Schrittweite für die Linien und den Pfeil
        const startAngle = 225;
        const endAngle = 310;
        const anglePerStep =
            Math.ceil((endAngle - startAngle) / (this.options.max - (this.options.max % this.options.step)));

        // Vergrößern der Schrittweite um 35% und Abziehen von 8.1 Grad
        const adjustedAnglePerStep = anglePerStep * 1.35 - 8.1/this.options.max;

        // Berechnung des Rotationswinkels
        // Da der Pfeil bereits bei 'startAngle' beginnt, wird dieser Winkel abgezogen
        let rotationAngle = selectedValue * adjustedAnglePerStep;

        // Sicherstellen, dass der Rotationswinkel den Endwinkel nicht überschreitet
        if (rotationAngle > endAngle) {
            rotationAngle = endAngle;
        }

        console.log("selectedValue", selectedValue,
            "rotationAngle", rotationAngle,
            "anglePerStep", anglePerStep,
            "adjustedAnglePerStep", adjustedAnglePerStep,
            "startAngle", startAngle,
            "endAngle", endAngle,
        );


        // Setze die Rotation des Pfeils
        arrowElement.setAttribute("transform", `rotate(${rotationAngle}, ${Cx}, ${Cy})`);
    }



    setMarkerPosition(svgRoot, Cx, Cy, angle) {
        const markerElement = svgRoot.querySelector("#marker25_1");
        markerElement.setAttribute("transform", `rotate(${angle - 90},${Cx},${Cy})`);
    }

    setInitialMarkerPosition(svgRoot, Cx, Cy) {
        const self = this;
        const initialAngle = 330 + (self.options.value / self.options.max * 300);
        this.setMarkerPosition(svgRoot, Cx, Cy, initialAngle);
    }

    setupEventListeners(svgRoot, Cx, Cy, R) {
        // Selbstreferenz für den Zugriff im Event Listener
        const self = this;

        // Event-Listener für das 'mousedown'-Ereignis auf dem SVG-Root-Element
        svgRoot.addEventListener('mousedown', function (e) {

            // Erstelle einen SVG-Punkt und setze seine x, y Koordinaten
            const point = svgRoot.createSVGPoint();
            point.x = e.clientX;
            point.y = e.clientY;

            // Hole die aktuelle Transformationsmatrix des SVG-Roots
            const ctm = svgRoot.getScreenCTM();
            // Invertiere die Transformationsmatrix
            const inverseCTM = ctm.inverse();

            // Transformiere den Punkt in den lokalen Koordinatenraum des SVG
            const localPoint = point.matrixTransform(inverseCTM);

            // Berechne die Abweichung des Punkts von der Mitte des Kreises
            const dx = localPoint.x - Cx;
            const dy = localPoint.y - Cy;

            // Berechne den Winkel zwischen dem Punkt und der x-Achse
            let angle = Math.atan2(dy, dx);

            // Konvertiere den Winkel in Grad und verschiebe ihn, sodass er im Bereich [0,360] liegt
            let angleDeg = (angle * 180 / Math.PI + 270) % 360;

            // Ermittle die Anzahl der Sektoren und den Winkel pro Sektor
            const numSectors = self.options.max;
            const anglePerSector = 270 / numSectors;

            // Toleranz für die Auswahl eines Sektors
            const tolerance = 0;

            // Bestimme den ausgewählten Sektor
            let selectedSector = Math.floor((angleDeg + tolerance) / anglePerSector);
            if (selectedSector >= numSectors) {
                selectedSector = 0;
            }

            // Aktualisiere den ausgewählten Wert und den globalen Zustand
            self.options.value = Math.ceil((selectedSector + 1) / self.options.step) * self.options.step;
            if (self.options.callback) {
                self.options.callback(self.options.value);
            }

            // Aktualisiere die Marker- und Pfeilpositionen basierend auf dem ausgewählten Wert
            self.setInitialMarkerPosition(svgRoot, Cx, Cy);
            self.setArrowPosition(
                svgRoot.querySelector("#arrow25_1"),
                self.options.value - 1,
                Cx, Cy, R
            );

            // Aktualisiere den Label-Text mit dem ausgewählten Wert
            self.sliderLabel.innerText = self.options.labelText + self.options.value;
        });
    }




    init() {
        this.createSliderElements();
        this.sliderObject.addEventListener('load', () => {
            const svgDoc = this.sliderObject.contentDocument;
            const svgRoot = svgDoc.documentElement;
            const circleElement = svgRoot.querySelector("#circle61");
            const Cx = parseFloat(circleElement.getAttribute('cx'));
            const Cy = parseFloat(circleElement.getAttribute('cy'));
            const R = 7500;
            this.addLinesToSVG(svgRoot, Cx, Cy, R);
            this.setupEventListeners(svgRoot, Cx, Cy, R);
            this.setInitialMarkerPosition(svgRoot, Cx, Cy);
        });
    }
}

customElements.define('my-slider', Slider);
