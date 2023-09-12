import { InteractionMatrix } from "./interaction.js";

// UI Getters
export const getNumberOfClasses = () => {
    return parseInt(document.getElementById('numClasses').value);
}

export const getNumberOfParticles = () => {
    return parseInt(document.getElementById('numParticles').value);
}

export const getInitialConfiguration = () => {
    return document.getElementById("initConfig").value;
}

export const getInteractionMatrix = () => {
    const gridContainer = document.getElementById("interactionMatrix");
    const numElements = gridContainer.childElementCount;
    const numColumns = Math.sqrt(numElements);
    const numberOfClasses = numColumns - 1;
    const newMatrix = new InteractionMatrix(numberOfClasses);
    const childNodes = gridContainer.childNodes;
    // Loop over rows from the first row (not the headers)
    for (let i = 1; i < numColumns; i++) {
        for (let j = 1; j < numColumns; j++) {
            const node = childNodes[i + j * (numColumns)];
            newMatrix.set(i-1, j-1, parseFloat(node.childNodes[0].textContent));
        }
    }
    return newMatrix;
}

// Interaction UI
export const removeInteractionMatrixUI = () => {
    const tableContainer = document.getElementById("interactionMatrix");
    tableContainer.replaceChildren();
}

export const createInteractionMatrixUI = (numberOfClasses, colors, onClick, initialValues) => {
    const cellSize = 35;
    const cellSizeStr = `${cellSize}px`;
    const gridContainer = document.getElementById("interactionMatrix");
    const template = `${cellSizeStr} `.repeat(numberOfClasses + 1);
    gridContainer.style.gridTemplateColumns = template;
    // Create grid from top left - start with the header
    for (let i = 0; i < numberOfClasses + 1; i++) {
        const item = document.createElement('div');
        item.classList = "interaction-item";
        item.style.backgroundColor = '#000000';
        if (i !== 0) {
            item.style.backgroundColor = colors[i - 1];
            item.style.height = cellSizeStr;
        }
        gridContainer.appendChild(item);
    }

    for (let i = 0; i < numberOfClasses; i++) {
        for (let j = 0; j < numberOfClasses + 1; j++) {
            const item = document.createElement('div');
            item.style.backgroundColor = '#000000';
            item.classList = "interaction-item";
            if (j === 0) {
                item.style.backgroundColor = colors[i];
                item.style.height = cellSizeStr;
                // item.style.width = `20px`;
            } else {
                // These are the cells that actually give the values
                const elementInput = document.createElement("div");
                elementInput.classList.add("interaction-item-value");
                const value = initialValues ? (initialValues.get(j - 1, i) ?? 0) : 0;
                elementInput.textContent = value.toFixed(2);
                elementInput.addEventListener('click', (e) => {
                    const target = e.target;
                    const currentValue = parseFloat(e.target.textContent);
                    const newValue = currentValue + 0.1;
                    if (newValue <= 1) {
                        target.textContent = `${(newValue.toFixed(2))}`;
                        if (onClick !== undefined) {
                            onClick(i, j-1, newValue)
                        }
                    }
                });
                elementInput.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    const target = e.target;
                    const currentValue = parseFloat(e.target.textContent);
                    const newValue = currentValue - 0.1;
                    target.textContent = `${(parseFloat(e.target.textContent) - 0.1).toFixed(2)}`;
                    if (newValue >= -1) {
                        target.textContent = `${(newValue.toFixed(2))}`;
                        if (onClick !== undefined) {
                            onClick(i, j-1, newValue)
                        }
                    }
                    return false;
                }, false);
                item.appendChild(elementInput);
            }
            gridContainer.appendChild(item);
        }
    }
}