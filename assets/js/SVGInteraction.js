export class SVGInteraction {
    constructor(svgRoot, options) {
        this.svgRoot = svgRoot;
        this.options = options;
        this.isDragging = false;
        this.lastUpdate = Date.now();
        this.delay = 2000 / this.options.max;
        this.attachEvents();
    }

    attachEvents() {
        this.svgRoot.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.svgRoot.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.svgRoot.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    handleMouseDown(e) {

        const point = this.svgRoot.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;

        const ctm = this.svgRoot.getScreenCTM();
        const inverseCTM = ctm.inverse();

        const localPoint = point.matrixTransform(inverseCTM);
        const dx = localPoint.x - this.Cx;  // Verwendung von this.Cx
        const dy = localPoint.y - this.Cy;


        let angle = Math.atan2(dy, dx);
// Rekalibrieren des Winkels, sodass 0° auf der unteren Seite des Kreises liegt
        let angleDeg = (angle * 180 / Math.PI + 270) % 360;

// Korrektur des Winkels, falls er außerhalb des gewünschten Bereichs liegt
        if (angleDeg < 0) {
            angleDeg += 360;
        }

        const selectedSector = Math.floor(angleDeg / anglePerSector);
        const selectedValue = (selectedSector * self.options.step) % optionsMax;

// Marker drehen
        const step = 360 / self.options.max;
        const roundedDeltaTheta = Math.round(angleDeg / step) * step;
        const maxTheta = 360 - step;
        const constrainedTheta = Math.min(maxTheta, Math.max(0, roundedDeltaTheta));
        const markerElement = svgRoot.querySelector("#marker25_1");
// Beachten Sie die Subtraktion von 360 Grad, um die Drehrichtung zu korrigieren
        markerElement.setAttribute("transform", `rotate(${constrainedTheta - 450},${Cx},${Cy})`);


        console.log(e, selectedValue + 1, selectedSector + 1);
    }

    handleMouseMove(e) {
        // const now = Date.now();
        // if (now - this.lastUpdate >= this.delay && !this.isCoolingDown) {
        //     this.lastUpdate = now;
        //     this.isCoolingDown = true;
        //
        //     setTimeout(() => {
        //         // Hier kommt die Original-Logik deines mousemove-Eventhandlers
        //         this.isCoolingDown = false;
        //     }, 100);
        // }
    }

    handleMouseUp(e) {
        this.isDragging = false;
        // Weitere Logik für mouseup, falls erforderlich
    }
}
