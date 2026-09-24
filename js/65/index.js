import pcsTools from './pcsTools.js';

const sample = pcsTools('#sample');

console.log(sample.text());

sample.text('Updated text').addClass('highlight');
console.log(sample.text());

console.assert(document.querySelector('#sample').classList.contains('highlight'));

sample.text('');
console.assert(sample.text() === '');

sample.text('Updated text');
