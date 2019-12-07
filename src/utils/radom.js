export const randBool = () => Math.random() < 0.5;

export const randInt = (max = 10000) => Math.floor(Math.random() * max);

export const sample = items => items[Math.floor(Math.random() * items.length)];
