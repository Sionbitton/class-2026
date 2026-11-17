// This file runs the game. options.js supplies the extra artwork and body choices.
// 'use strict' makes JavaScript report some mistakes instead of silently accepting them.
'use strict';

// 1. Part settings. x, y, and w are percentages of the play area.
// For example, x: 50 means centered horizontally; w: 15 means 15% of its width.
const parts = [
    {
        name: 'Eyes', file: 'eyes', x: 50, y: 39, w: 15
    },
    {
        name: 'Ears', file: 'ears', x: 50, y: 47, w: 45
    },
    {
        name: 'Eyebrows', file: 'eyebrows', x: 50, y: 31, w: 21
    },
    {
        name: 'Glasses', file: 'glasses', x: 50, y: 39, w: 24
    },
    {
        name: 'Hat', file: 'hat', x: 50, y: 17, w: 29
    },
    {
        name: 'Moustache', file: 'moustache', x: 50, y: 58, w: 24
    },
    {
        name: 'Mouth', file: 'mouth', x: 50, y: 66, w: 19
    },
    {
        name: 'Nose', file: 'nose', x: 50, y: 49, w: 13
    },
    {
        name: 'Arms', file: 'arms', x: 50, y: 57, w: 60
    },
    {
        name: 'Shoes', file: 'shoes', x: 50, y: 86, w: 36
    }
];
const stage = document.querySelector('#stage');
// ... is the spread operator. Here it copies the array, so adding choices to
// parts does not add entries to originals. The objects inside are still shared.
const originals = [...parts];
for (const original of originals) {
    original.category = original.file;
    original.src = ['eyes', 'nose', 'mouth', 'hat', 'shoes'].includes(original.file)
        ? `media/toy-${original.file}.png` : `media/${original.file}.png`;
    // [name, drawing] takes the two values out of each artwork pair.
    // { ...original } copies its settings, then replaces the name and image.
    for (const [name, drawing] of options[original.file]) {
        parts.push({
             ...original,
            name,
            src: sticker(drawing) 
        });
    }
}

// 2. Current choices. A zero-based index means 0 is the first body.
let currentCategory = 'eyes';
let currentBody = 0;

function chooseBody(index) {
    currentBody = index;
    const body = document.querySelector('.potato');
    body.src = bodyOptions[index].src;
    body.alt = `${bodyOptions[index].name} body`;
    document.querySelectorAll('.body-choice').forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    announce(`${bodyOptions[index].name} potato chosen`);
}
// forEach runs this code once per body. The arrow function is the callback
// that runs now; the click callback inside runs later, when the player clicks.
bodyOptions.forEach((body, index) => {
    const button = document.createElement('button');
    button.className = 'body-choice';
    button.setAttribute('aria-pressed', String(index === 0));
    button.setAttribute('aria-label', `Choose ${body.name.toLowerCase()} body`);
    const img = document.createElement('img');
    img.src = body.src;
    img.alt = '';
    const label = document.createElement('span');
    label.textContent = body.name;
    button.append(img, label);
    button.addEventListener('click', () => chooseBody(index));
    document.querySelector('#bodies').append(button);
});
// map creates a new array. This one holds the four actual HTML buttons.
const controls = ['smaller', 'larger', 'rotate', 'remove'].map(id => document.getElementById(id));
let selected = null;
let layer = 1;
let drag = null;
// Clamp keeps a number within limits, so pieces cannot be moved too far away.
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
// This message is read by screen readers without adding visible text to the game.

function announce(text) {
    document.querySelector('#status').textContent = text;
}

function updateCount() {
    const count = stage.querySelectorAll('.placed').length;
    document.querySelector('#count').textContent = `${count} ${count === 1 ? 'part' : 'parts'} added`;
}
// ?. means "only continue if this value is not null or undefined."
// The condition ? yes : no expression is a shorter if/else that returns a value.

function select(item) {
    selected?.classList.remove('selected');
    selected = item;
    selected?.classList.add('selected');
    document.querySelector('#selection').textContent = item ? `${item.alt} selected` : 'Pick a part to get started';
    controls.forEach(button => button.disabled = !item);
}

function position(item, x, y) {
    item.style.left = `${clamp(x, 5, 95)}%`;
    item.style.top = `${clamp(y, 5, 95)}%`;
}

// 3. Make a piece, then connect its mouse/touch and keyboard controls.
// Default parameters use the part's usual position unless x and y are supplied.

function addPart(part, x = part.x, y = part.y) {
    if (stage.querySelectorAll('.placed').length >= 100) {
        announce('Your pal has lots of parts! Remove a part to add another.');
        return null;
    }
    const item = document.createElement('img');
    item.src = part.src;
    // dataset stores our own data-* values on the HTML element as strings.
    item.dataset.category = part.category;
    item.dataset.name = part.name;
    item.alt = part.name;
    item.className = 'placed';
    item.draggable = false;
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `${part.name}, use arrow keys to move; Delete to remove`);
    item.style.width = `${part.w}%`;
    item.style.zIndex = ++layer;
    item.dataset.rotation = '0';
    position(item, x, y);
    item.addEventListener('focus', () => select(item));
    // Pointer events work with a mouse, touch, or pen. Remember where the piece
    // was grabbed so its center does not jump underneath the pointer.
    item.addEventListener('pointerdown', event => {
        if (event.button !== 0)
            return;
        event.preventDefault();
        select(item);
        item.focus();
        item.style.zIndex = ++layer;
        // rect tells us the play area's position and size in CSS pixels relative to the viewport.
        const rect = stage.getBoundingClientRect();
        drag = {
            item,
            pointerId: event.pointerId,
            offsetX: event.clientX - rect.left - parseFloat(item.style.left) / 100 * rect.width,
            offsetY: event.clientY - rect.top - parseFloat(item.style.top) / 100 * rect.height
        };
        // Keep receiving movement even if the pointer leaves the image.
        item.setPointerCapture(event.pointerId);
    });
    // Subtract the play area's viewport position, then convert pixels to percent.
    // parseFloat turns a CSS string such as '50%' into the number 50.
    item.addEventListener('pointermove', event => {
        if (!drag || drag.item !== item || drag.pointerId !== event.pointerId)
            return;
        const rect = stage.getBoundingClientRect();
        position(item, (event.clientX - rect.left - drag.offsetX) / rect.width * 100, (event.clientY - rect.top - drag.offsetY) / rect.height * 100);
    });
    for (const event of ['pointerup', 'pointercancel', 'lostpointercapture'])
        item.addEventListener(event, () => {
            drag = null;
        });
    // Each arrow key has an [x change, y change] pair. Shift moves five steps.
    item.addEventListener('keydown', event => {
        const moves = {
            ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1]
        };
        if (moves[event.key]) {
            event.preventDefault();
            const [x, y] = moves[event.key];
            position(item, parseFloat(item.style.left) + x * (event.shiftKey ? 5 : 1), parseFloat(item.style.top) + y * (event.shiftKey ? 5 : 1));
        }
        else if (event.key === 'Delete' || event.key === 'Backspace') {
            event.preventDefault();
            removeSelected();
        }
    });
    stage.append(item);
    select(item);
    updateCount();
    announce(`${part.name} added`);
    return item;
}

// 4. Build the drawer for the chosen category. render means update the page.

function renderParts() {
    document.querySelector('#parts').replaceChildren();
    parts.forEach((part, index) => {
        if (part.category !== currentCategory)
            return;
        const button = document.createElement('button');
        button.className = 'part';
        button.draggable = true;
        button.setAttribute('aria-label', `Add ${part.name.toLowerCase()}`);
        const img = document.createElement('img');
        img.src = part.src;
        img.alt = '';
        img.draggable = false;
        const label = document.createElement('span');
        label.textContent = part.name;
        button.append(img, label);
        button.addEventListener('click', () => addPart(part));
        // dataTransfer carries the array index from the drawer to the drop event.
        button.addEventListener('dragstart', event => {
            event.dataTransfer.setData('text/plain', String(index));
            event.dataTransfer.effectAllowed = 'copy';
            // The button includes a label and background. Use only its image
            // as the floating drag preview, so the whole card does not follow.
            event.dataTransfer.setDragImage(img, img.clientWidth / 2, img.clientHeight / 2);
        });
        document.querySelector('#parts').append(button);
    });
    document.querySelectorAll('.category').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === currentCategory)));
}
originals.forEach(part => {
    const button = document.createElement('button');
    button.className = 'category';
    button.dataset.category = part.category;
    const img = document.createElement('img');
    img.src = part.src;
    img.alt = '';
    const label = document.createElement('span');
    label.textContent = part.name;
    button.append(img, label);
    button.addEventListener('click', () => {
        currentCategory = part.category;
        renderParts();
    });
    document.querySelector('#categories').append(button);
});
renderParts();
// Browsers normally reject drops. preventDefault lets this area accept them.
stage.addEventListener('dragover', event => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
});
stage.addEventListener('drop', event => {
    event.preventDefault();
    const value = event.dataTransfer.getData('text/plain');
    // This regular expression accepts digits only. Reject unknown dragged data.
    if (!/^\d+$/.test(value) || !parts[Number(value)])
        return;
    const rect = stage.getBoundingClientRect();
    addPart(parts[Number(value)], (event.clientX - rect.left) / rect.width * 100, (event.clientY - rect.top) / rect.height * 100);
});
stage.addEventListener('pointerdown', event => {
    if (event.target === stage)
        select(null);
});

// 5. Buttons for changing or removing the selected piece.

function removeSelected() {
    if (!selected)
        return;
    const name = selected.alt;
    currentCategory = selected.dataset.category;
    selected.remove();
    select(null);
    drag = null;
    updateCount();
    renderParts();
    document.querySelector(`[aria-label="Add ${name.toLowerCase()}"]`)?.focus();
    announce(`${name} removed`);
}
document.querySelector('#remove').addEventListener('click', removeSelected);

// A factor of 0.9 makes the width 10% smaller; 1.1 makes it 10% bigger.
function resize(factor) {
    if (selected)
        selected.style.width = `${clamp(parseFloat(selected.style.width) * factor, 6, 85)}%`;
}
document.querySelector('#smaller').addEventListener('click', () => resize(.9));
document.querySelector('#larger').addEventListener('click', () => resize(1.1));
// % is remainder: after 345 + 15 degrees, the angle wraps back to 0.
document.querySelector('#rotate').addEventListener('click', () => {
    if (!selected)
        return;
    const angle = (Number(selected.dataset.rotation) + 15) % 360;
    selected.dataset.rotation = String(angle);
    selected.style.transform = `translate(-50%,-50%) rotate(${angle}deg)`;
});

function reset() {
    stage.querySelectorAll('.placed').forEach(item => item.remove());
    stage.style.removeProperty('aspect-ratio');
    stage.style.removeProperty('min-height');
    select(null);
    drag = null;
    layer = 1;
    updateCount();
}
document.querySelector('#reset').addEventListener('click', () => {
    reset();
    announce('Fresh potato, ready to create');
});
// Math.random gives a number from 0 up to, but not including, 1.
// Math.floor rounds down, giving us a valid random array index.
// filter makes an array containing only the choices in one category.
document.querySelector('#surprise').addEventListener('click', () => {
    reset();
    chooseBody(Math.floor(Math.random() * bodyOptions.length));
    for (const original of originals) {
        if (['glasses', 'eyebrows', 'moustache', 'hat'].includes(original.category) && Math.random() < .4)
            continue;
        const choices = parts.filter(part => part.category === original.category);
        const part = choices[Math.floor(Math.random() * choices.length)];
        addPart(part, part.x + (Math.random() - .5) * 4, part.y + (Math.random() - .5) * 4);
    }
    select(null);
    announce('Your surprise character is ready');
});

// 6. Save a character as a recipe, not as a screenshot.
// localStorage keeps text in this browser after reload. It is not a cloud backup.
// JSON.stringify changes objects into text; JSON.parse changes that text back.

const STORAGE_KEY = 'spud-studio-pals-v1';
const saveMessage = document.querySelector('#save-message');
let savedPals = [];
let storageReadable = true;
const validNumber = (value, min, max) => Number.isFinite(value) && value >= min && value <= max;
// Saved text can be broken or changed outside this game, so check it before use.
// some asks "does at least one match?"; every asks "do all of them pass?"
// && means AND; || means OR. A failed check stops the remaining AND checks.

function validPal(pal) {
    return pal && typeof pal.id === 'string' && typeof pal.name === 'string' && pal.name.length <= 40 &&
        Number.isInteger(pal.body) && bodyOptions[pal.body] && Array.isArray(pal.parts) && pal.parts.length <= 100 &&
        (pal.ratio === undefined || validNumber(pal.ratio, .2, 5)) &&
        pal.parts.every(piece => piece && parts.some(part => part.name === piece.name) && validNumber(piece.x, 5, 95) && validNumber(piece.y, 5, 95) && validNumber(piece.width, 6, 85) && validNumber(piece.rotation, 0, 359) && validNumber(piece.layer, 0, 1000000));
}
// try/catch handles invalid JSON or blocked storage without crashing the game.

function readGallery() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            savedPals = [];
            return;
        }
        const data = JSON.parse(raw);
        if (!Array.isArray(data) || data.length > 100 || !data.every(validPal))
            throw new Error('Invalid saved gallery');
        savedPals = data;
    }
    catch (error) {
        storageReadable = false;
        const message = document.querySelector('#gallery-error');
        message.hidden = false;
        message.textContent = 'We could not read your saved pals. Your existing saves have not been changed. Try your usual browser with storage enabled.';
    }
}
// map turns each placed HTML image into a small object with its saved settings.
// The ID combines the time with random characters; the name is for the player.

function capturePal() {
    return {
        
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        
        name: document.querySelector('#pal-name').value.trim() || `Potato pal ${savedPals.length + 1}`,
        
        body: currentBody,
        
        ratio: stage.clientWidth / stage.clientHeight,
        
        parts: [...stage.querySelectorAll('.placed')].map(item => ({
            
            name: item.dataset.name,
            x: parseFloat(item.style.left),
            y: parseFloat(item.style.top),
            width: parseFloat(item.style.width),
            rotation: Number(item.dataset.rotation),
            layer: Number(item.style.zIndex)
        
        }))
    
    };
}

// 7. A gallery thumbnail uses the same body and pieces at a smaller scale.
// find returns the first matching part. No image URLs come from saved data.

function makePreview(pal) {
    const preview = document.createElement('div');
    preview.className = 'pal-preview';
    preview.setAttribute('aria-hidden', 'true');
    preview.style.aspectRatio = String(pal.ratio || 1.35);
    const body = document.createElement('img');
    body.className = 'potato';
    body.src = bodyOptions[pal.body].src;
    body.alt = '';
    preview.append(body);
    for (const piece of pal.parts) {
        const img = document.createElement('img');
        img.src = parts.find(part => part.name === piece.name).src;
        img.alt = '';
        img.className = 'preview-part';
        img.style.cssText = `left:${piece.x}%;top:${piece.y}%;width:${piece.width}%;z-index:${piece.layer};transform:translate(-50%,-50%) rotate(${piece.rotation}deg)`;
        preview.append(img);
    }
    return preview;
}
// Copy before sort so we do not change the saved array. Smaller layers go first.
// Keeping the original width/height ratio prevents parts shifting on other screens.

function openPal(pal) {
    reset();
    chooseBody(pal.body);
    if (pal.ratio) {
        stage.style.aspectRatio = String(pal.ratio);
        stage.style.minHeight = '0';
    }
    for (const piece of [...pal.parts].sort((a, b) => a.layer - b.layer)) {
        const item = addPart(parts.find(part => part.name === piece.name), piece.x, piece.y);
        item.style.width = `${piece.width}%`;
        item.dataset.rotation = String(piece.rotation);
        item.style.transform = `translate(-50%,-50%) rotate(${piece.rotation}deg)`;
    }
    select(null);
    document.querySelector('#pal-name').value = pal.name;
    saveMessage.textContent = `${pal.name} is ready to play! Save again to keep a new copy.`;
    document.querySelector('#stage').scrollIntoView({ block: 'center', behavior: 'instant' });
    document.querySelector('#reset').focus({ preventScroll: true });
}
// Copy before reverse so the newest save displays first without changing the data.
// textContent displays names as plain text, even if someone types HTML tags.

function renderGallery() {
    const gallery = document.querySelector('#gallery');
    gallery.replaceChildren();
    document.querySelector('#saved-count').textContent = `${savedPals.length} saved`;
    if (!savedPals.length) {
        const empty = document.createElement('p');
        empty.className = 'empty-gallery';
        empty.textContent = 'Your potato pals will live here. Make one and tap Save my pal!';
        gallery.append(empty);
        return;
    }
    for (const pal of [...savedPals].reverse()) {
        const card = document.createElement('article');
        card.className = 'pal-card';
        const title = document.createElement('h3');
        title.textContent = pal.name;
        const open = document.createElement('button');
        open.textContent = 'Play with this pal';
        open.setAttribute('aria-label', `Play with ${pal.name}`);
        open.addEventListener('click', () => openPal(pal));
        card.append(makePreview(pal), title, open);
        gallery.append(card);
    }
}

// 8. Submit saves a NEW copy. preventDefault stops the form reloading the page.
// Only update the gallery after localStorage.setItem succeeds.
document.querySelector('#save-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!storageReadable) {
        saveMessage.textContent = 'Saving is unavailable because we could not read this browser’s gallery. Your existing saves are safe.';
        return;
    }
    // Refresh first so saving from another tab does not replace newer creations.
    readGallery();
    if (!storageReadable) {
        saveMessage.textContent = 'Could not save. Please check the gallery message below.';
        return;
    }
    if (savedPals.length >= 100) {
        saveMessage.textContent = 'Your gallery has 100 pals! This gallery is full; your existing pals are safe.';
        return;
    }
    const pal = capturePal();
    if (!validPal(pal)) {
        saveMessage.textContent = 'Something went wrong with this pal. Please try again.';
        return;
    }
    try {
        const next = [...savedPals, pal];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        savedPals = next;
        renderGallery();
        saveMessage.textContent = `Saved ${pal.name}! Find your pal in My potato heads below.`;
    }
    catch (error) {
        saveMessage.textContent = 'Could not save. This browser’s storage may be full or turned off. Keep this page open so you do not lose your pal.';
    }
});
// Start up: load existing saves, then display them.
readGallery();
renderGallery();

// Keep the current workbench as well as the explicitly named gallery saves.
const draftKey = 'spud-studio-current-v1';
let restoring = true;
try {
    const draft = JSON.parse(localStorage.getItem(draftKey) || 'null');
    if (validPal(draft)) openPal(draft);
} catch { announce('The previous workbench could not be restored.'); }
restoring = false;
function saveDraft() {
    if (restoring) return;
    try { const draft = capturePal(); if (validPal(draft)) localStorage.setItem(draftKey, JSON.stringify(draft)); }
    catch { announce('Current changes could not be saved in this browser.'); }
}
let draftTimer;
new MutationObserver(() => {
    clearTimeout(draftTimer); draftTimer = setTimeout(saveDraft, 150);
}).observe(stage, {subtree:true,childList:true,attributes:true,attributeFilter:['style','src']});
document.querySelector('#pal-name').addEventListener('input',saveDraft);
window.addEventListener('pagehide',saveDraft);
// A small original looping tune. Browsers require a click before audio starts.
let audioContext, musicTimer, noteNumber = 0;
const melody = [262,330,392,330,294,349,440,349];
document.querySelector('#music').addEventListener('click', async () => {
    const button = document.querySelector('#music');
    if (musicTimer) {
        clearInterval(musicTimer); musicTimer = null;
        button.textContent = 'Play music'; button.setAttribute('aria-pressed','false'); return;
    }
    try {
        audioContext ||= new AudioContext(); await audioContext.resume();
        const playNote = () => {
            const oscillator = audioContext.createOscillator(), volume = audioContext.createGain();
            oscillator.type = 'sine'; oscillator.frequency.value = melody[noteNumber++ % melody.length];
            volume.gain.setValueAtTime(.06,audioContext.currentTime);
            volume.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.32);
            oscillator.connect(volume); volume.connect(audioContext.destination);
            oscillator.start(); oscillator.stop(audioContext.currentTime+.35);
        };
        playNote(); musicTimer = setInterval(playNote,400);
        button.textContent = 'Pause music'; button.setAttribute('aria-pressed','true');
    } catch { announce('Audio is unavailable in this browser.'); }
});
