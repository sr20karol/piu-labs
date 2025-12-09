export function randomHsl() {
    return `hsl(${Math.floor(Math.random() * 360)}, 70%, 75%)`;
}

export function generateId() {
    return crypto.randomUUID();
}
