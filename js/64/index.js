import pcsTools from './pcsTools.js';

const sample = pcsTools('#sample');

pcsTools('#hide').click(() => sample.hide());
pcsTools('#show').click(() => sample.show());

const sparkleButton = document.querySelector('#sparkle');

sparkleButton.addEventListener('click', () => {
    sparkleButton.disabled = true;
    sample.sparkle(1000, 5000);

    setTimeout(() => {
        sparkleButton.disabled = false;
    }, 5000);
});
