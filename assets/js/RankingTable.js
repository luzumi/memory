import { globalState } from "./globalState.js";
import handles from "./handles.js";

export default class RankingTable {
    constructor(parentContainer) {
        this.parentContainer = parentContainer;
        this.currentPageIndex = 0;
        this.createTable();
    }

    // Erstellt die Gesamttabelle inklusive Header, Body und Pagination
    createTable() {
        this.rankingTable = this.createElement('table', 'ranking-table', this.parentContainer);
        this.createHeader();
        this.createBody();
        this.createPagination();
    }

    // Erstellt den Header der Tabelle
    createHeader() {
        const thead = this.createElement('thead', null, this.rankingTable);
        const headerRow = this.createElement('tr', null, thead);
        ['Rang', 'Benutzername', 'Karten', 'Zeit', 'Punkte'].forEach(text => {
            this.createElement('th', null, headerRow, text);
        });
    }

    // Erstellt den Body der Tabelle
    createBody() {
        const tbody = this.createElement('tbody', null, this.rankingTable);
        // Lade die sortierten Scores
        handles.loadScore();

        if (Array.isArray(globalState.sortedScores)) {
            const startIndex = this.currentPageIndex * 10;
            const endIndex = startIndex + 10;
            const slicedScores = globalState.sortedScores.slice(startIndex, endIndex);

            slicedScores.forEach((score, index) => {
                const row = this.createElement('tr', null, tbody);
                const actualRank = startIndex + index + 1;
                [actualRank, score.username, score.cards, score.time, score.points].forEach(text => {
                    this.createElement('td', null, row, text);
                });
            });
        }
    }

    // Erstellt die Pagination-Buttons
    createPagination() {
        if (!this.paginationContainer) {
            this.paginationContainer = this.createElement('div', 'pagination-container', this.parentContainer);
            this.createPaginationButton('Vorherige Seite', () => {
                if (this.currentPageIndex > 0) {
                    this.currentPageIndex--;
                    this.refreshTable();
                }
            });
            this.createPaginationButton('Nächste Seite', () => {
                const totalScores = globalState.sortedScores.length;
                if (this.currentPageIndex < Math.floor(totalScores / 10)) {
                    this.currentPageIndex++;
                    this.refreshTable();
                }
            });
        }
    }

    // Hilfsfunktion zur Erstellung eines Elements
    createElement(tag, className, parent, innerText = null) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerText) element.innerText = innerText;
        parent.appendChild(element);
        return element;
    }

    // Hilfsfunktion zur Erstellung eines Pagination-Buttons
    createPaginationButton(label, clickHandler) {
        const button = this.createElement('button', null, this.paginationContainer, label);
        button.addEventListener('click', clickHandler);
    }

    // Aktualisiert die Tabelle
    refreshTable() {
        if (this.rankingTable) this.rankingTable.remove();
        if (this.paginationContainer) {
            while (this.paginationContainer.firstChild) {
                this.paginationContainer.firstChild.remove();
            }
            this.paginationContainer = null;
        }
        this.createTable();
    }

    // Zeigt die Tabelle an
    showTable() {
        this.refreshTable();
        this.rankingTable.style.display = 'table';
    }

    // Verbirgt die Tabelle
    hideTable() {
        this.rankingTable.style.display = 'none';
    }
}
