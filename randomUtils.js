import { Vector } from "./vector.js";

// Random stuff
export function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min; // The maximum is exclusive and the minimum is inclusive
}

export function getRandomVectorInRange(min, max) {
    return new Vector(getRandomInRange(min, max), getRandomInRange(min, max));
}

export function getRandomInUnitCircle() {
    const randVec = getRandomVectorInRange(-1.0, 1.0);
    const dist = Math.hypot(randVec.x, randVec.y);
    const rand = getRandomInRange(0.0, 1.0);
    return new Vector(rand * randVec.x / dist, rand * randVec.y / dist);
}

export function getRandomInCircle(radius) {
    const randVec = getRandomInUnitCircle();
    return new Vector(randVec.x * radius, randVec.y * radius);
}

export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}