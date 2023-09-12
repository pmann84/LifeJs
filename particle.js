import { Vector } from "./vector.js";
import { circle } from "./rendering.js";
import * as RUtils from "./randomUtils.js";

const worldToScreen = (ctx, position, world) => {
    const x = (position.x / (world.xMax - world.xMin)) * ctx.canvas.clientWidth + 0.5 * ctx.canvas.clientWidth;
    const y = (position.y / (world.yMax - world.yMin)) * ctx.canvas.clientHeight + 0.5 * ctx.canvas.clientHeight;
    return new Vector(x, y);
}

export class Particle {
    constructor(id, position, velocity = new Vector(0, 0)) {
        this.position = position;
        this.velocity = velocity;
        this.id = id;
    }

    render(ctx, color, world) {
        const screenPos = worldToScreen(ctx, this.position, world);
        circle(ctx, screenPos.x, screenPos.y, 2, color);
    }
}

// Creation utilities
const createRandomPosition = (bounds, factor = 0.0) => {
    const ySize = factor * (bounds.yMax - bounds.yMax);
    const xSize = factor * (bounds.xMax - bounds.xMax);
    return new Vector(RUtils.getRandomInRange(bounds.xMin + xSize, bounds.xMax - xSize), RUtils.getRandomInRange(bounds.yMin + ySize, bounds.yMax - ySize));
}

const createRandomVelocity = (maxVelocity) => {
    return new Vector(RUtils.getRandomInRange(-maxVelocity, maxVelocity), RUtils.getRandomInRange(-maxVelocity, maxVelocity));
}

export class ParticleFactory {
    static uniform(count, numberOfClasses, worldBounds) {
        const particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(RUtils.getRandomInt(numberOfClasses), createRandomPosition(worldBounds, 0.9), new Vector()));
        }
        return particles;
    }
    
    static unitCircle(count, numberOfClasses, worldBounds) {
        const particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(RUtils.getRandomInt(numberOfClasses), RUtils.getRandomInUnitCircle(), new Vector()));
        }
        return particles;
    }
    
    static circle(count, numberOfClasses, worldBounds) {
        const particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(RUtils.getRandomInt(numberOfClasses), RUtils.getRandomInCircle(3.0), new Vector()));
        }
        return particles;
    }

    static bands(count, numberOfClasses, worldBounds) {
        let particles = [];
        const numBands = numberOfClasses;
        const particlesPerBand = count / numBands;
        const xExtentInterval = (worldBounds.xMax - worldBounds.xMin) / numBands;
        const yExtentInterval = (worldBounds.yMax - worldBounds.yMin) / 2;
        const yMin = worldBounds.yMin + (worldBounds.yMax - worldBounds.yMin) / 4;
        const yMax = yMin + yExtentInterval;
        const bandBounds = { yMin: yMin, yMax: yMax, xMin: worldBounds.xMin, xMax: worldBounds.xMin + xExtentInterval };
        for (let i = 0; i < numberOfClasses; i++) {
            for (let j = 0; j < particlesPerBand; j++) {
                particles.push(new Particle(i, createRandomPosition(bandBounds), new Vector()));
            }
            bandBounds.xMin += xExtentInterval;
            bandBounds.xMax += xExtentInterval;
        }
        return particles;
    }
}