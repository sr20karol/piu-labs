// ui.js
import { store } from './store.js';

const board = document.getElementById('board');
const cntSquares = document.getElementById('cntSquares');
const cntCircles = document.getElementById('cntCircles');

function createShapeEl(shape) {
    const el = document.createElement('div');
    el.className = `shape ${shape.type}`;
    el.style.backgroundColor = shape.color;
    el.dataset.id = shape.id;
    return el;
}

function render(state) {
    cntSquares.textContent = store.countSquares;
    cntCircles.textContent = store.countCircles;

    const existingIds = new Set([...board.children].map((c) => c.dataset.id));
    const stateIds = new Set(state.shapes.map((s) => s.id));

    for (const shape of state.shapes) {
        if (!existingIds.has(shape.id)) {
            board.appendChild(createShapeEl(shape));
        } else {
            const el = board.querySelector(`[data-id="${shape.id}"]`);
            if (el) el.style.backgroundColor = shape.color;
        }
    }

    for (const child of [...board.children]) {
        if (!stateIds.has(child.dataset.id)) {
            child.remove();
        }
    }
}

board.addEventListener('click', (e) => {
    const id = e.target?.dataset?.id;
    if (id) store.removeShape(id);
});

store.subscribe(render);
