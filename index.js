import { InteractionMatrix } from "./interaction.js";
import { Simulation } from "./simulation.js";
import { BoundaryTypes } from "./boundaryTypes.js";
import { createInteractionMatrixUI, removeInteractionMatrixUI, getNumberOfParticles, getNumberOfClasses, getInteractionMatrix, getInitialConfiguration } from "./ui.js";
import { ParticleFactory } from "./particle.js";
import { clear } from "./rendering.js";

// Boilerplate
const setCanvasSize = (width, height) => {
    const c = document.getElementById("screen");
    c.width = width;
    c.height = height;
}

window.addEventListener("resize", (e) => {
    setCanvasSize(window.innerWidth, window.innerHeight);
    run();
});
``
const getContext = () => {
    const canvas = document.getElementById("screen");
    return canvas.getContext("2d");
}

// Sim setup 
const MaxExtent = 10;
const worldBounds = {
    xMin: -MaxExtent,
    xMax: MaxExtent,
    yMin: -MaxExtent,
    yMax: MaxExtent,
}

// UI Setup
let currentRequest, sim, interactions;
let playing = true;

const initialiseInteractions = () => {
    const numberOfClasses = getNumberOfClasses();
    interactions = new InteractionMatrix(numberOfClasses);
}

const onInteractionChanged = (i, j, newValue) => {
    sim.interactions.set(i, j, newValue);
}

document.getElementById('initConfig').addEventListener('change', (e) => {
    reset();
    start();
})

document.getElementById('playPauseBtn').addEventListener('click', (e) => {
    const btn = document.getElementById('playPauseBtn');
    if (btn.innerHTML === "Play") {
        btn.innerHTML = "Pause";
        playing = false;
    } else if (btn.innerHTML === "Pause") {
        btn.innerHTML = "Play";
        playing = true;
    }
});

document.getElementById('resetBtn').addEventListener('click', (e) => {
    reset();
    start();
});

const redrawInteractionUI = () => {
    removeInteractionMatrixUI();
    createInteractionMatrixUI(getNumberOfClasses(), InteractionMatrix.ColorMap, onInteractionChanged, currentMatrix);
}

document.getElementById('randoBtn').addEventListener('click', (e) => {
    interactions.randomise();
    removeInteractionMatrixUI();
    createInteractionMatrixUI(getNumberOfClasses(), InteractionMatrix.ColorMap, onInteractionChanged, interactions);
});

document.getElementById('identBtn').addEventListener('click', (e) => {
    interactions.clear();
    removeInteractionMatrixUI();
    createInteractionMatrixUI(getNumberOfClasses(), InteractionMatrix.ColorMap, onInteractionChanged, interactions);
});

document.getElementById('numClasses').addEventListener('change', (e) => {
    initialiseInteractions();
    removeInteractionMatrixUI();
    createInteractionMatrixUI(parseInt(e.target.value), InteractionMatrix.ColorMap, onInteractionChanged);
    reset();
    start();
});

const constructSimulation = (numberOfClasses, numberOfParticles, initialInteractions) => {
    interactions = initialInteractions ?? new InteractionMatrix(numberOfClasses);
    const config = getInitialConfiguration();
    let particles = [];
    if (config === "bands") {
        particles = ParticleFactory.bands(numberOfParticles, numberOfClasses, worldBounds);
    } else if (config === "random") {
        particles = ParticleFactory.uniform(numberOfParticles, numberOfClasses, worldBounds);
    }
    sim = new Simulation(worldBounds, BoundaryTypes.Periodic, interactions, InteractionMatrix.ColorMap);
    sim.addParticles(particles);
}

const reset = () => {
    // Get the current interaction matrix and use it to keep the same values on reset
    const numberOfClasses = getNumberOfClasses();
    const numberOfParticles = getNumberOfParticles();
    const currentMatrix = getInteractionMatrix();
    cancelAnimationFrame(currentRequest);
    constructSimulation(numberOfClasses, numberOfParticles, currentMatrix);
    removeInteractionMatrixUI();
    createInteractionMatrixUI(getNumberOfClasses(), InteractionMatrix.ColorMap, onInteractionChanged, currentMatrix);
}

// Render loop
const run = () => {
    if (playing) {
        const ctx = getContext();
        clear(ctx);
        sim.update();
        sim.render(ctx);
    }
    currentRequest = requestAnimationFrame(run);
}

const start = () => {
    currentRequest = requestAnimationFrame(run);
}

// Set the initial size
setCanvasSize(window.innerWidth, window.innerHeight);
const numberOfClasses = getNumberOfClasses();
const numberOfParticles = getNumberOfParticles();
constructSimulation(numberOfClasses, numberOfParticles);
removeInteractionMatrixUI();
createInteractionMatrixUI(getNumberOfClasses(), InteractionMatrix.ColorMap, onInteractionChanged);
start();

