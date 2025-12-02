const columnsConfig = [
    { id: 'todo', title: 'Do zrobienia' },
    { id: 'doing', title: 'W trakcie' },
    { id: 'done', title: 'Zrobione' },
];

const board = document.getElementById('board');

function randomColor() {
    const colors = [
        '#2a1a4d',
        '#4b2e7f',
        '#3a0ca3',
        '#7209b7',
        '#f72585',
        '#4361ee',
        '#4cc9f0',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function saveBoard() {
    const data = {};

    document.querySelectorAll('.column').forEach((col) => {
        const colId = col.dataset.id;
        const cards = [...col.querySelectorAll('.card')].map((c) => ({
            id: c.dataset.id,
            text: c.querySelector('.content').innerText,
            color: c.style.background,
        }));
        data[colId] = cards;
    });

    localStorage.setItem('kanban-board', JSON.stringify(data));
}

function loadBoard() {
    const data = JSON.parse(localStorage.getItem('kanban-board'));
    if (!data) return;

    for (let colId in data) {
        const column = document.querySelector(
            `.column[data-id='${colId}'] .cards`
        );
        data[colId].forEach((card) => {
            createCard(column, card.text, card.color, card.id);
        });
        updateCounter(colId);
    }
}

function createColumn({ id, title }) {
    const col = document.createElement('div');
    col.className = 'column';
    col.dataset.id = id;

    col.innerHTML = `
        <div class="column-header">
            <span>${title}</span>
            <span class="counter" id="count-${id}">0</span>
        </div>
        <button class="add-card">Dodaj kartę</button>
        <button class="color-column">Koloruj kolumnę</button>
        <button class="sort-column">Sortuj</button>
        <div class="cards"></div>
    `;

    board.appendChild(col);
}

function createCard(
    columnEl,
    text = 'Nowa karta',
    color = randomColor(),
    id = Date.now()
) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = id;
    card.style.background = color;

    card.innerHTML = `
        <div class="delete-btn">x</div>
        <div class="content" contenteditable="true">${text}</div>
        <div class="controls">
            <button class="move-btn left">←</button>
            <button class="move-btn right">→</button>
            <button class="move-btn recolor">🎨</button>
        </div>
    `;

    columnEl.appendChild(card);
    saveBoard();
}

function updateCounter(colId) {
    const col = document.querySelector(`.column[data-id='${colId}']`);
    const count = col.querySelectorAll('.card').length;
    col.querySelector('.counter').innerText = count;
}

columnsConfig.forEach((c) => createColumn(c));

board.addEventListener('click', (e) => {
    const col = e.target.closest('.column');
    if (!col) return;

    const cardsEl = col.querySelector('.cards');

    if (e.target.classList.contains('add-card')) {
        createCard(cardsEl);
        updateCounter(col.dataset.id);
    }

    if (e.target.classList.contains('color-column')) {
        cardsEl.querySelectorAll('.card').forEach((card) => {
            card.style.background = randomColor();
        });
        saveBoard();
    }

    if (e.target.classList.contains('sort-column')) {
        const cards = [...cardsEl.querySelectorAll('.card')];
        cards.sort((a, b) =>
            a
                .querySelector('.content')
                .innerText.localeCompare(b.querySelector('.content').innerText)
        );
        cards.forEach((c) => cardsEl.appendChild(c));
        saveBoard();
    }

    if (e.target.classList.contains('delete-btn')) {
        const card = e.target.closest('.card');
        card.remove();
        updateCounter(col.dataset.id);
        saveBoard();
    }

    if (e.target.classList.contains('move-btn')) {
        const card = e.target.closest('.card');
        const currentCol = e.target.closest('.column');
        const cols = [...document.querySelectorAll('.column')];
        const index = cols.indexOf(currentCol);

        if (e.target.classList.contains('left') && index > 0) {
            cols[index - 1].querySelector('.cards').appendChild(card);
            updateCounter(cols[index - 1].dataset.id);
            updateCounter(currentCol.dataset.id);
        }

        if (e.target.classList.contains('right') && index < cols.length - 1) {
            cols[index + 1].querySelector('.cards').appendChild(card);
            updateCounter(cols[index + 1].dataset.id);
            updateCounter(currentCol.dataset.id);
        }

        saveBoard();
    }

    if (e.target.classList.contains('recolor')) {
        const card = e.target.closest('.card');
        card.style.background = randomColor();
        saveBoard();
    }
});

board.addEventListener('input', (e) => {
    if (e.target.classList.contains('content')) {
        saveBoard();
    }
});

loadBoard();
