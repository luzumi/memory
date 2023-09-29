import { globalState } from './globalState.js';

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
        if (imgIds === img.id) return;

        handles.toggleTimer();

        handles.showCard(img, evt);

        // Wenn zwei Karten aufgedeckt sind, Timer neu starten
        if (globalState.clickedImage.length === 2) {
            handles.flipTimeout = setTimeout(() => handles.handleCardMatch(), 4000);
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
            const gameEndTime = new Date().getTime();
            handles.totalGameTime = (gameEndTime - globalState.gameStartTime) / 1000;
            globalState.gameStartTime = false;
            const cardFactor = globalState.gridSize / 2;

            const base = 1000;
            const log = 2;      // Basis des Logarithmus
            const timeMalus = 20;     // Zeitstrafmultiplikator

            globalState.score += Math.round(base * Math.log(log * cardFactor) - timeMalus * this.totalGameTime);

            document.querySelector('#score').textContent = handles.totalGameTime + ' Sekunden';
            document.querySelector('#final-score').textContent = 'Punktzahl: ' + globalState.score;
            document.querySelector('#win-message').style.display = 'block';
            document.querySelector('#win-message').classList.add('blink');
        }
    },
    toggleTimer: function () {
        // Timer für die gesamte Spielzeit starten
        if (!globalState.gameStartTime) {
            globalState.gameStartTime = new Date().getTime();
            setInterval(() => {
                const timeDiff = Date.now() - globalState.gameStartTime;
                const timeDiffSeconds = Math.round(timeDiff / 1000);
                document.getElementById('score').textContent = `Laufzeit: ${timeDiffSeconds} Sekunden`;
            }, 1000);
        }

        // Wenn bereits zwei Karten aufgedeckt sind und der Timer noch nicht gestartet wurde
        if (globalState.clickedImage.length === 2 && !handles.flipTimeout) {
            // Timer für das automatische Umdrehen der Karten starten
            handles.flipTimeout = setTimeout(() => handles.handleCardMatch(), 3000);
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
}

export default handles; 