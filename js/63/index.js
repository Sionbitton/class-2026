import messageBox from './messageBox.js';

document.querySelector('#default').addEventListener('click', () => {
    messageBox('Hello!');
});

document.querySelector('#colors').addEventListener('click', () => {
    messageBox('Choose a color', ['Red', 'Blue']);
});

document.querySelector('#question').addEventListener('click', () => {
    messageBox('Is this enough homework?', ['Yes', 'No', 'Maybe'],
        usersChoice => console.log('You picked ' + usersChoice));
});

document.querySelector('#callback').addEventListener('click', () => {
    messageBox('Click OK to continue', undefined,
        usersChoice => console.log('You picked ' + usersChoice));
});
