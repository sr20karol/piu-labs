// store.js
import { generateId, randomHsl } from './helpers.js';

class Store {
    constructor() {
        const saved = localStorage.getItem('shapes');
        this.state = saved ? JSON.parse(saved) : { shapes: [] };

        this.subscribers = [];
    }

    subscribe(fn) {
        this.subscribers.push(fn);
        fn(this.state);
    }

    notify() {
        localStorage.setItem('shapes', JSON.stringify(this.state));
        this.subscribers.forEach((fn) => fn(this.state));
    }

    get shapes() {
        return this.state.shapes;
    }

    get countSquares() {
        return this.state.shapes.filter((s) => s.type === 'square').length;
    }

    get countCircles() {
        return this.state.shapes.filter((s) => s.type === 'circle').length;
    }

    addShape(type) {
        this.state.shapes.push({
            id: generateId(),
            type,
            color: randomHsl(),
        });
        this.notify();
    }

    removeShape(id) {
        this.state.shapes = this.state.shapes.filter((s) => s.id !== id);
        this.notify();
    }

    recolor(type) {
        this.state.shapes = this.state.shapes.map((s) =>
            s.type === type ? { ...s, color: randomHsl() } : s
        );
        this.notify();
    }
}

export const store = new Store();
