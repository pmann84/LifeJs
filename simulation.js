import { World } from "./world.js";
import { Vector } from "./vector.js";
import { BoundaryTypes } from "./boundaryTypes.js";

const force = (r, a, b = 0.4) => {
    if (r < b) {
        return (r / b) - 1.0;
    } else if (b < r && r < 1) {
        return a * ((1.0 - Math.abs(2 * r - 1.0 - b)) / (1.0 - b));
    } else {
        return 0;
    }
}

export class Simulation {
    #dt = 0.01;
    #rmax = 2.0;
    #frictionHalfLife = 0.02;
    #friction = Math.pow(0.5, this.#dt / this.#frictionHalfLife);
    #forceFactor = 50;

    constructor(bounds, boundary, interactions, colorIdMap) {
        this.particles = [];
        this.world = new World(bounds, boundary);
        this.interactions = interactions;
        this.colorIdMap = colorIdMap;
    }

    addParticles(particles) {
        this.particles = this.particles.concat(particles);
    }

    update() {
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];

            // Integrate velocity
            let totalForce = new Vector(0, 0);
            for (let j = 0; j < this.particles.length; j++) {
                if (i === j) continue;
                const otherParticle = this.particles[j];
                const rx = otherParticle.position.x - particle.position.x;
                const ry = otherParticle.position.y - particle.position.y;
                const r = Math.hypot(rx, ry);
                if (r > 0 && r < this.#rmax) {
                    const interactionFactor = this.interactions.get(particle.id, otherParticle.id);
                    const forceExerted = force(r / this.#rmax, interactionFactor);
                    totalForce.x += (rx / r) * forceExerted;
                    totalForce.y += (ry / r) * forceExerted;
                }
            }
            totalForce.x *= this.#rmax * this.#forceFactor;
            totalForce.y *= this.#rmax * this.#forceFactor;
        
            let newVel = new Vector(particle.velocity.x * this.#friction + totalForce.x * this.#dt, particle.velocity.y * this.#friction + totalForce.y * this.#dt);
            particle.velocity = newVel;

            // Integrate position
            let newPos = new Vector(particle.position.x + particle.velocity.x * this.#dt, particle.position.y + particle.velocity.y * this.#dt);
        
            // Handle boundary conditions
            // if (this.world.boundary === BoundaryTypes.Periodic) {
            //     // TODO: Make a boundary condition handler to abstract this away!
            //     // BUG: This doesnt quite work well with the attraction behaviour
            //     // the organisms get stuck across the boundary - presumably the
            //     // distance calculations are incorrect over the boundary
            //     if (newPos.x > this.world.bounds.xMax) {
            //         newPos.x = this.world.bounds.xMin;
            //     }
            //     if (newPos.x < this.world.bounds.xMin) {
            //         newPos.x = this.world.bounds.xMax;
            //     }
            //     if (newPos.y > this.world.bounds.yMax) {
            //         newPos.y = this.world.bounds.yMin;
            //     }
            //     if (newPos.y < this.world.bounds.yMin) {
            //         newPos.y = this.world.bounds.yMax;
            //     }
            // }
            particle.position = newPos;
        }

    }
    
    render(ctx) {
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            particle.render(ctx, this.colorIdMap[particle.id], this.world.bounds);
        }
    }
}