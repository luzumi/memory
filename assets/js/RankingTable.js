import {domMapping} from "./domMapping.js";
import {globalState} from "./globalState.js";
import handles from "./handles.js";

export default class RankingTable {

    constructor(parentContainer) {
        this.parentContainer = parentContainer;
        this.paginationContainer= null;
        this.currentPageIndex = 0;
        this.createTable();
    }

    createTable() {
        this.rankingTable = domMapping.createElementDynamical(
            this.parentContainer,
            'table',
            'ranking-table'
        );
        this.createHeader();
        this.createBody();
        this.createPagination();
    }

    createHeader() {
        const thead = domMapping.createElementDynamical(this.rankingTable, 'thead');
        const headerRow = domMapping.createElementDynamical(thead, 'tr');
        ['Rang', 'Benutzername', 'Karten', 'Zeit', 'Punkte'].forEach(text => {
            const th = domMapping.createElementDynamical(headerRow, 'th');
            th.innerText = text;
        });
    }

    createBody() {
        const tbody = domMapping.createElementDynamical(this.rankingTable, 'tbody');
        const startIndex = this.currentPageIndex * 10;
        const endIndex = startIndex + 10;
        handles.loadScore();
        console.log(globalState.sortedScores)
        if (Array.isArray(globalState.sortedScores)) {
            const slicedScores = globalState.sortedScores.slice(startIndex, endIndex);
            slicedScores.forEach((score, index) => {
                const row = domMapping.createElementDynamical(tbody, 'tr');
                const actualRank = startIndex + index + 1; // Berücksichtigt die aktuelle Seite
                [actualRank, score.username, score.cards, score.time, score.points].forEach(text => {
                    const td = domMapping.createElementDynamical(row, 'td');
                    td.innerText = text;
                });
            });
        }
    }


    createPagination() {
        if (!this.paginationContainer) {
            this.paginationContainer = domMapping.createElementDynamical(this.parentContainer, 'div', 'pagination-container');
            const prevButton = domMapping.createElementDynamical(this.paginationContainer, 'button', null, 'Vorherige Seite');
            const nextButton = domMapping.createElementDynamical(this.paginationContainer, 'button', null, 'Nächste Seite');

            prevButton.addEventListener('click', () => {
                if (this.currentPageIndex > 0) {
                    this.currentPageIndex--;
                    this.refreshTable();
                }
            });

            nextButton.addEventListener('click', () => {
                const totalScores = globalState.sortedScores.length;
                if (this.currentPageIndex < Math.floor(totalScores / 10)) {
                    this.currentPageIndex++;
                    this.refreshTable();
                }
            });
        }
    }

    refreshTable() {
        if (this.rankingTable) this.rankingTable.remove();
        if (this.paginationContainer) {
            while (this.paginationContainer.firstChild) {
                this.paginationContainer.removeChild(this.paginationContainer.firstChild);
            }
            this.paginationContainer.remove();

            this.paginationContainer = null; // Setze es zurück auf null, damit es beim nächsten Aufruf von createPagination wieder erstellt wird
        }
        this.createTable();
    }

    showTable() {
        this.refreshTable();
        this.rankingTable.style.display = 'table';
    }

    hideTable() {
        this.rankingTable.style.display = 'none';
        document.querySelectorAll('.pagination-container button').forEach((button) => button.remove());
    }
}
