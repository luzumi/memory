import { globalState } from './globalState.js';
import domMapping from "./domMapping.js";
import AnimateHeader from "./animateHeader.js";

const handles = {
    flipTimeout: null,
    moveStartTime: new Date().getTime(),
    score: 0,
    totalGameTime: 0,
    handleClick: function (evt) {
        // Initialisierung, falls noch nicht geschehen
        if (!globalState.clickedImage) {
            globalState.clickedImage = [];
            handles.moveStartTime = new Date().getTime();
        }

        let img = evt.currentTarget.querySelector('img');
        const imgIds = globalState.clickedImage.map(imgElement => imgElement.id);
        if (imgIds.includes(img.id)) return;
        if (img.src.includes('founded')) return;


        handles.toggleTimer();

        handles.showCard(img, evt);

        // Wenn zwei Karten aufgedeckt sind, Timer neu starten
        if (globalState.clickedImage.length === 2) {
            handles.flipTimeout = setTimeout(() => handles.handleCardMatch(), globalState.waitingTime * 1000);
        }
    },
    handleCardMatch: function () {
        handles.checkPair();

        // Timer zurücksetzen und Array leeren
        clearTimeout(handles.flipTimeout);
        globalState.clickedImage.length = 0;
        handles.checkWin();
    },
    checkWin: function () {
        const allFounded = Array.from(document.querySelectorAll('.Playground img')).every(img => img.src.includes('founded'));
        if (allFounded) {
            clearInterval(globalState.timerId);
            const gameEndTime = new Date().getTime();
            handles.totalGameTime = (gameEndTime - globalState.gameStartTime) / 1000;
            globalState.gameStartTime = null;
            const cardFactor = globalState.gridSize / 2;

            const base = 1000;
            const log = 2;      // Basis des Logarithmus
            const timeMalus = 20;     // Zeitstrafmultiplikator

            globalState.score += Math.round(base * Math.log(log * cardFactor / globalState.waitingTime) - timeMalus * this.totalGameTime);


            document.querySelector('#score').textContent = 'Laufzeit: ' + this.totalGameTime;
            const winMessage = document.querySelector('#win-message');
            if (winMessage !== null) {
                winMessage.style.display = 'block';
                winMessage.classList.add('blink');
            }
            else {
                const winMessage = domMapping.createElementDynamical(document.querySelector('.Playground'), 'div', 'win-message', 'Gewonnen!');
                winMessage.id = 'win-message';
                winMessage.textContent = 'Gewonnen!';
                winMessage.classList.add('win-message','blink');
                winMessage.style.display = 'flex';
                winMessage.style.flexDirection = 'column';
                domMapping.createElementDynamical(winMessage, 'div', 'final-score', `Punktzahl: ${globalState.score}`);
            }
            this.saveScore();
        }
    },
    toggleTimer: function () {
        // Timer für die gesamte Spielzeit starten
        if (!globalState.gameStartTime) {
            globalState.gameStartTime = new Date().getTime();
            globalState.timerId = setInterval(() => {
                // console.log('Timer läuft', globalState.timerId);
                const timeDiff = Date.now() - globalState.gameStartTime;
                const timeDiffSeconds = Math.round(timeDiff / 1000);
                document.getElementById('score').textContent = `Laufzeit: ${timeDiffSeconds} Sekunden`;
            }, 1000);
        }

        // Wenn bereits zwei Karten aufgedeckt sind und der Timer noch nicht gestartet wurde
        if (globalState.clickedImage.length === 2 && !handles.flipTimeout) {
            // Timer für das automatische Umdrehen der Karten starten
            handles.flipTimeout = setTimeout(
                () => handles.handleCardMatch(), globalState.waitingTime * 1000);
            return;
        }

        // Wenn bereits zwei Karten aufgedeckt sind und der Timer gestartet wurde (zum Abbrechen)
        if (globalState.clickedImage.length === 2 && handles.flipTimeout) {
            // Timer stoppen
            clearTimeout(handles.flipTimeout);
            // Sofortige Überprüfung der Karten
            handles.handleCardMatch();
            // Array leeren
            globalState.clickedImage.length = 0;
        }
    },
    showCard: function (img, evt) {
        img = evt.currentTarget.querySelector('img');
        globalState.clickedImage.push(img);
        img.src = img.src.includes('backside') ? img.dataset.frontSrc : `${globalState.getBackgrounds()}/backside.png`;
    },
    checkPair: function () {
        if (globalState.clickedImage[0].src === globalState.clickedImage[1].src) {
            globalState.clickedImage[0].parentElement.removeEventListener('click', handles.handleClick);
            globalState.clickedImage[1].parentElement.removeEventListener('click', handles.handleClick);
            globalState.clickedImage[0].src = `${globalState.getBackgrounds()}founded.png`;
            globalState.clickedImage[1].src = `${globalState.getBackgrounds()}founded.png`;
            globalState.score += 1000 - Math.round(handles.totalGameTime * 10);
        } else {
            globalState.clickedImage[0].src = `${globalState.getBackgrounds()}backside.png`;
            globalState.clickedImage[1].src = `${globalState.getBackgrounds()}backside.png`;
        }
    },
    saveScore: function () {
        const playerScore = {
            username: globalState.userName,
            cards: globalState.gridSize,
            time: handles.totalGameTime,
            points: globalState.score
        };
        const scores = JSON.parse(localStorage.getItem('scores')) ?? [];
        scores.push(playerScore);
        localStorage.setItem('scores', JSON.stringify(scores));
    },
    loadScore: function () {
        const storedScores = JSON.parse(localStorage.getItem("scores")) || [];
        globalState.sortedScores = storedScores.sort((a, b) => b.points - a.points);
        return globalState.sortedScores;
    },
    resetGame() {
        let elements = globalState.elements.playground;
        console.log('reset', globalState.images)
        if (globalState.timerId) {
            clearInterval(globalState.timerId);
            globalState.timerId = null;
            globalState.gameStartTime = null;
            document.querySelector('#score').textContent = 'Laufzeit: 0 Sekunden';
        }
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




        // Schritt 3: Neues Grid erstellen und Event-Listener hinzufügen
        domMapping.createGrid();
        AnimateHeader.appendEventListeners(globalState.elements);  // Event-Listener für das neue Grid hinzufügen
    }
}

export default handles; 