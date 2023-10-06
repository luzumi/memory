import {domMapping} from "./domMapping.js";
import {globalState} from "./globalState.js";
import handles from "./handles.js";
import {Slider} from "./slider.js";
import RankingTable from "./RankingTable.js";

export default class Menu {
    constructor() {
        this.menuDiv = null;
        this.menuButton = null;
        this.menuContent = null;
        this.sliderLabel = null;
        this.cardSlider = null;
        this.setSlider = null;
        this.difficulty = null;
        this.rankingContainer = null;
        this.toggleRankingButton = null;
    }
    initialize() {
        // Initialisiere das Menü und dessen Elemente
        this.initMenuElements();
        // Füge Event-Listener hinzu
        this.addEventListeners();
    }

    initMenuElements() {
        const runtimeContainer = document.querySelector('#runtime-container');
        this.menuButton = this.createElement('div', 'menu-button', '☰', runtimeContainer);
        this.menuDiv = document.querySelector('#menu-container');
        this.menuContent = this.createElement('div', 'menu-content', null, this.menuDiv);

        // Benutzername-Feld
        this.initUserNameField();
        // Slider für Karten, Set und Schwierigkeit
        this.initSliders();
        // Buttons für Neustart und Rangliste
        this.initControlButtons();
    }

    initUserNameField() {
        // Initialisiere das Benutzername-Feld
        this.userNameLabel = domMapping.createElementDynamical(this.menuContent, 'label', null, 'Benutzername:');
        this.userNameLabel.for = 'user-name';
        this.userName = domMapping.createElementDynamical(this.menuContent, 'input', 'user-name', globalState.userName);
        this.userName.id = 'user-name';
        this.userName.value = globalState.userName;
    }

    initSliders() {
        // Initialisiere die Slider für Kartenanzahl, Set und Schwierigkeit
        this.sliderDiv = domMapping.createElementDynamical(this.menuContent, 'div', 'slider-div');

        this.cardSlider = new Slider(this.sliderDiv, {
            containerClass: 'slider-container',
            labelText: 'Karten:',
            sliderId: 'cardSlider',
            min: 2,
            max: 16,
            step: 2,
            value: globalState.gridSize,
            callback: value => { globalState.gridSize = value; }
        });

        this.setSlider = new Slider(this.sliderDiv, {
            containerClass: 'slider-container',
            labelText: 'Set:',
            sliderId: 'setSlider',
            min: 1,
            max: 4,
            step: 1,
            value: globalState.setId,
            callback: value => { globalState.setId = value; }
        });

        this.difficulty = new Slider(this.sliderDiv, {
            containerClass: 'slider-container',
            labelText: 'Geschwindigkeit:',
            sliderId: 'difficulty',
            min: 1,
            max: 3,
            step: 1,
            value: globalState.waitingTime,
            callback: value => { globalState.waitingTime = value; }
        });
    }

    initControlButtons() {
        // Initialisiere den Neustart- und den Ranglisten-Button
        this.rankingContainer = domMapping.createElementDynamical(this.menuContent, 'div', 'ranking-container');
        this.toggleRankingButton = domMapping.createElementDynamical(this.rankingContainer, 'button', 'toggle-ranking-button', 'Rangliste anzeigen');
        this.restartButton = domMapping.createElementDynamical(this.menuContent, 'button', 'restart-button', 'Neustart');

    }

    createElement(tag, className, innerText, parent) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerText) element.innerText = innerText;
        parent.appendChild(element);
        return element;
    }

    addEventListeners() {
        // Fügt Event-Listener zu den verschiedenen Menüelementen hinzu
        this.userName.addEventListener('input', () => {
            globalState.userName = this.userName.value;
        });

        this.userName.addEventListener('focus', function() {
            this.select();
        });

        this.menuButton.addEventListener('click', () => {
            const isHidden = this.menuContent.style.display === 'none';
            this.menuContent.style.display = isHidden ? 'block' : 'none';
            this.menuDiv.style.display = isHidden ? 'block' : 'none';

            if (isHidden) {
                handles.loadScore();
            }
        });

        this.restartButton.addEventListener('click', () => {
            globalState.elements.grid = null;
            // globalState.images = ImagePool.createImagePool(globalState.setId);
            this.menuContent.style.display = 'none';
            this.menuDiv.style.display = 'none'; // Fügen Sie diese Zeile hinzu
            handles.resetGame();
        });

        this.toggleRankingButton.addEventListener('click', () => {
            if (!this.isTableVisible) {
                if (!this.rankingTable) {
                    this.rankingTable = new RankingTable(this.rankingContainer);
                } else {
                    this.rankingTable.showTable();
                }
                this.toggleRankingButton.textContent = 'Rangliste ausblenden';
                this.isTableVisible = true;
            } else {
                this.rankingTable.hideTable();
                this.toggleRankingButton.textContent = 'Rangliste anzeigen';
                this.isTableVisible = false;
            }
        });
    }
};
