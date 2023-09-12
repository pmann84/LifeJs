import * as RUtils from "./randomUtils.js";

export class InteractionMatrix {
    static ColorMap = ['green', 'red', 'blue', 'orange', 'yellow', 'white'];
    #numberOfClasses;
    #matrix = [];

    constructor(numberOfClasses) {
        this.#numberOfClasses = numberOfClasses;
        this.#initialise();
    }

    #initialise() {
        this.#matrix = new Array( this.#numberOfClasses).fill(0).map(() => new Array( this.#numberOfClasses).fill(0));
    }

    randomise() {
        this.#matrix = [];
        for (var i = 0 ; i < this.#numberOfClasses; i++) {
            this.#matrix[i] = []; // Initialize inner array
            for (var j = 0; j < this.#numberOfClasses; j++) { // i++ needs to be j++
                this.#matrix[i][j] = RUtils.getRandomInRange(-1.0, 1.0);
            }
        }
    }

    clear() {
        this.#matrix = [];
        for (var i = 0 ; i < this.#numberOfClasses; i++) {
            this.#matrix[i] = []; // Initialize inner array
            for (var j = 0; j < this.#numberOfClasses; j++) { // i++ needs to be j++
                this.#matrix[i][j] = 0.0;
            }
        }
    }
    
    get(i, j) {
        return this.#matrix[i][j];
    }

    set(i, j, value) {
        this.#matrix[i][j] = value;
    }
}