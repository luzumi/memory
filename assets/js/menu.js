import {domMapping} from "./domMapping.js";
import {globalState} from "./globalState.js";
import { AnimateHeader } from "./animateHeader.js";
import handles from "./handles.js";

export default class Menu {
    constructor() {
        this.menuDiv = null;
        this.menuButton = null;
        this.menuContent = null;
        this.sliderContainer = null;
        this.sliderLabel = null;
        this.cardSlider = null;
        this.setSlider = null;
        this.cardCount = null;
        this.difficulty = null;
        this.rankingContainer = null;
        this.toggleRankingButton = null;
    }

    initialize() {
        const runtimeContainer = document.querySelector('#runtime-container');

        this.menuButton = domMapping.createElementDynamical(runtimeContainer, 'div', 'menu-button', '☰');
        this.menuDiv = document.querySelector('#menu-container');
        this.menuContent = domMapping.createElementDynamical(this.menuDiv, 'div', 'menu-content');

        this.userName = domMapping.createElementDynamical(this.menuContent, 'input', 'user-name', globalState.userName);

        this.cardSlider = this.createSlider(
            this.menuContent,
            'slider-container',
            'Anzahl der Karten:',
            'cardSlider',
            2, 16, 2,
            globalState.gridSize,
            'cardCount',
            value => { globalState.gridSize = value; }
        );

        this.setSlider = this.createSlider(
            this.menuContent,
            'slider-container',
            'Set',
            'setSlider',
            1,
            4,
            1,
            globalState.setId,
            'setCount',
            value => { globalState.setId = value; }
        );

        this.difficulty = this.createSlider(
            this.menuContent,
            'slider-container',
            'Schwierigkeit',
            'difficulty',
            1,
            3,
            1,
            globalState.waitingTime / 1000,
            'difficultyCount',
            value => { globalState.waitingTime = value * 1000; }
        );
        // Erstelle einen Container für die Rangliste im Menü
        this.rankingContainer = domMapping.createElementDynamical(this.menuContent, 'div', 'ranking-container');
        this.toggleRankingButton = domMapping.createElementDynamical(this.rankingContainer, 'button', 'toggle-ranking-button', 'Rangliste anzeigen');
        this.restartButton = domMapping.createElementDynamical(this.menuContent, 'button', 'restart-button', 'Neustart');

        this.addEventListeners();
    }
    resetGame() {
        // Schritt 1: Altes Grid und Event-Listener löschen
        let elements = globalState.elements.playground;
        console.log(elements)
        while (elements.firstChild) {
            // Event-Listener entfernen, falls vorhanden
            if (elements.firstChild.firstChild) {
                elements.firstChild.firstChild.removeEventListener('click', handles.handleClick);
            }
            elements.removeChild(elements.firstChild);
        }
        // Schritt 2: globalState zurücksetzen
        globalState.clickedImage = [];
        globalState.score = 0;
        // Weitere Zustandsvariablen hier zurücksetzen...

        // Schritt 3: Neues Grid erstellen und Event-Listener hinzufügen
        domMapping.createGrid();
        AnimateHeader.appendEventListeners(globalState.elements);  // Event-Listener für das neue Grid hinzufügen
    }



    createSlider(parent, containerClass, labelText, sliderId, min, max, step, value, valueDisplayId, callback) {
        const sliderContainer = domMapping.createElementDynamical(parent, 'div', containerClass);
        const sliderLabel = domMapping.createElementDynamical(sliderContainer, 'label', 'sliderLabel', labelText);
        sliderLabel.for = sliderId;

        const cardSlider = domMapping.createElementDynamical(sliderContainer, 'input');
        cardSlider.type = 'range';
        cardSlider.id = sliderId;
        cardSlider.min = min;
        cardSlider.max = max;
        cardSlider.step = step;
        cardSlider.value = value;

        const valueDisplay = domMapping.createElementDynamical(sliderContainer, 'span', null, value.toString());
        valueDisplay.id = valueDisplayId;

        if (callback) {
            cardSlider.addEventListener('input', () => {
                const newValue = cardSlider.value;
                valueDisplay.innerHTML = newValue; // Aktualisiere das digitale Display
                callback(parseInt(newValue, 10));
            });
        }

        return cardSlider;
    }
    addEventListeners() {
        this.userName.addEventListener('input', () => {
            globalState.userName = this.userName.value;
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

            this.menuContent.style.display = 'none';
            this.menuDiv.style.display = 'none'; // Fügen Sie diese Zeile hinzu
            this.resetGame();
        });
        this.cardSlider.addEventListener('input', () => {
            const value = this.cardSlider.value;
            if (this.cardCount !== null) {
                this.cardCount.innerHTML = value;
            }
            // Aktualisiere globalState.gridSize
            globalState.gridSize = parseInt(value, 10);
        });
        this.rankingContainer.addEventListener('click', () => {
            const rankingTable = document.querySelector('.ranking-table');
            if (rankingTable) {
                this.toggleRankingButton.textContent = 'Rangliste anzeigen';
                rankingTable.remove();
            } else {
                const newRankingTable = this.createRankingTable();
                this.rankingContainer.appendChild(newRankingTable);  // Hier wird die Änderung vorgenommen
                this.toggleRankingButton.textContent = 'Rangliste ausblenden';
            }
        });
    }
    createRankingTable() {
        // Erstelle Tabelle
        const rankingTable = domMapping.createElementDynamical(
            this.rankingContainer, // Ändere diesen Teil
            'table',
            'ranking-table'
        );

        // Prüfe, ob Scores geladen sind
        if(!globalState.sortedScores) {
            handles.loadScore();
        }


        // Erstelle Tabellenkopf
        const thead = domMapping.createElementDynamical(rankingTable, 'thead');
        const headerRow = domMapping.createElementDynamical(thead, 'tr');
        console.log(JSON.parse(localStorage.getItem('scores')));
        ['Rang', 'Benutzername', 'Karten', 'Zeit', 'Punkte'].forEach(text => {
            const th = domMapping.createElementDynamical(headerRow, 'th');
            th.innerText = text;
        });

        // Erstelle Tabellenkörper
        const tbody = domMapping.createElementDynamical(rankingTable, 'tbody');

        if (Array.isArray(globalState.sortedScores)) {
            globalState.sortedScores.forEach((score, index) => {
                const row = domMapping.createElementDynamical(tbody, 'tr');

                [index + 1, score.username, score.cards, score.time, score.points].forEach(text => {
                    const td = domMapping.createElementDynamical(row, 'td');
                    td.innerText = text;
                });
            });
        }
        return rankingTable;
    }


};
