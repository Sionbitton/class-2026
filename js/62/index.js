'use strict';

let nextNumber = 2;

function addButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = nextNumber++;
    button.addEventListener('click', addButton);
    document.body.appendChild(button);
}

document.querySelector('button').addEventListener('click', addButton);
