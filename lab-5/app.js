// app.js
import './ui.js';
import { store } from './store.js';

document.getElementById('addSquare').onclick = () => store.addShape('square');
document.getElementById('addCircle').onclick = () => store.addShape('circle');

document.getElementById('recolorSquares').onclick = () =>
    store.recolor('square');

document.getElementById('recolorCircles').onclick = () =>
    store.recolor('circle');
