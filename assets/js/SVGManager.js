export class SVGManager {
    static createElement(svgRoot, type, attributes) {
        const element = document.createElementNS('http://www.w3.org/2000/svg', type);
        for (const [key, value] of Object.entries(attributes)) {
            element.setAttribute(key, value);
        }
        svgRoot.appendChild(element);
        return element;
    }
}
