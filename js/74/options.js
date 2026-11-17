'use strict';
// Artwork data for the game. Read index.js first if you are learning the game logic.
// SVG is an image described with text: paths, circles, colors, and coordinates.
// The long drawing strings below are picture data, not JavaScript you need to memorize.
// You can change a label/color here without understanding every drawing coordinate.
// sticker has default width/height values. encodeURIComponent makes the SVG safe
// inside a data URL, which lets an <img> show an image without a separate file.
const sticker = (drawing, width = 240, height = 140) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><g stroke="#30264b" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">${drawing}</g></svg>`);
// Each category contains [display name, SVG drawing] pairs.
const options = {
    eyes: [
        [
            'Star eyes', '<path fill="#ffca38" d="m55 15 13 29 33 3-25 23 7 33-28-17-29 17 7-33L8 47l33-3z M175 15l13 29 33 3-25 23 7 33-28-17-29 17 7-33-25-23 33-3z"/>'
        ], [
            'Sleepy eyes', '<path fill="none" d="M15 55q40 50 85 0m40 0q40 50 85 0M30 73l-9 15m32-5v17m30-24 10 15m62-18-9 15m32-5v17m30-24 10 15"/>'
        ]
    ],
    ears: [
        [
            'Alien ears', '<path fill="#8bdc70" d="M70 120Q-15 40 25 15q60-25 60 95m85 10q85-80 45-105-60-25-60 95"/><path fill="none" d="M55 85 35 40m150 45 20-45"/>'
        ], [
            'Purple ears', '<ellipse fill="#bda0f4" cx="40" cy="70" rx="34" ry="58"/><ellipse fill="#bda0f4" cx="200" cy="70" rx="34" ry="58"/><path fill="none" d="M45 40q-25 15 0 55m150-55q25 15 0 55"/>'
        ]
    ],
    eyebrows: [
        [
            'Rainbow brows', '<path fill="none" stroke="#e94f7c" stroke-width="18" d="M15 65q40-65 85 0m40 0q40-65 85 0"/><path fill="none" stroke="#ffce47" stroke-width="8" d="M15 65q40-45 85 0m40 0q40-45 85 0"/>'
        ], [
            'Silly brows', '<path fill="#6b3da5" d="m15 55 25-35 60 35-10 25-45-25-15 20z m125 0 60-35 25 35-15 20-15-20-45 25z"/>'
        ]
    ],
    glasses: [
        [
            'Heart glasses', '<path fill="#f889aa" d="M105 50Q85 0 55 25 15 0 10 45q0 35 45 65 50-30 50-60zm30 0q20-50 50-25 40-25 45 20 0 35-45 65-50-30-50-60z"/><path fill="none" d="M105 55q15-15 30 0"/>'
        ], [
            'Space goggles', '<rect x="8" y="30" width="224" height="75" rx="35" fill="#6bd3e6"/><path fill="none" stroke="white" stroke-width="10" d="m40 80 25-30m10 30 25-30m50 30 25-30"/>'
        ]
    ],
    hat: [
        [
            'Party hat', '<path fill="#9e7de7" d="m35 120 85-110 85 110z"/><path stroke="#ffcf45" stroke-width="16" d="m78 65 63 30m-35-64 55 25"/><circle fill="#ef6c9e" cx="120" cy="12" r="10"/>'
        ], [
            'Crown', '<path fill="#ffcd3f" d="m25 110-10-80 60 40 45-60 45 60 60-40-10 80z"/><circle fill="#ed6792" cx="120" cy="90" r="12"/>'
        ]
    ],
    moustache: [
        [
            'Curly moustache', '<path fill="#7442a8" d="M120 65Q80 10 40 55 10 80 10 45q-35 100 70 65l40-25 40 25q105 35 70-65 0 35-30 10-40-45-80 10z"/>'
        ], [
            'Orange whiskers', '<path fill="none" stroke="#dc6826" stroke-width="15" d="m95 60-75-25m75 45L10 85m135-25 75-25m-75 45 85 5"/>'
        ]
    ],
    mouth: [
        [
            'Big grin', '<path fill="white" d="M25 35q95 50 190 0-10 120-95 95Q40 130 25 35z"/><path fill="none" d="M40 70q80 40 160 0m-80-8v45m-40-45 5 40m75-40-5 40"/>'
        ], [
            'Tongue out', '<path fill="#542c64" d="M30 35q90 30 180 0-10 70-90 70T30 35z"/><path fill="#f47a9f" d="M95 70h60v35q-30 55-60 0z"/><path fill="none" d="M125 75v30"/>'
        ]
    ],
    nose: [
        [
            'Clown nose', '<circle fill="#ee5474" cx="120" cy="70" r="55"/><ellipse fill="#ffb4c5" stroke="none" cx="103" cy="50" rx="15" ry="11"/>'
        ], [
            'Carrot nose', '<path fill="#ff9d36" d="m65 15 140 60-140 50q-40-55 0-110z"/><path fill="none" d="m85 35-5 20m5 35-5 15"/>'
        ]
    ],
    arms: [
        [
            'Robot arms', '<path fill="none" stroke="#6bc5d8" stroke-width="22" d="m90 100-40-35-25 25m125 10 40-35 25 25"/><path fill="none" stroke="#30264b" d="m15 82 10 18 18-12m154 0 18 12 10-18"/>'
        ], [
            'Waving arms', '<path fill="none" stroke="#f4b66c" stroke-width="16" d="M85 120 45 70V30m110 90 40-50V30"/><path fill="none" d="M45 35 25 20m20 15V8m0 27 20-15m130 15-20-15m20 15V8m0 27 20-15"/>'
        ]
    ],
    shoes: [
        [
            'Rocket boots', '<path fill="#b89aef" d="M20 25h75v55l15 35H10l10-35zm125 0h75v55l10 35H130l15-35z"/><path fill="#ffbc33" d="m25 120 15 15 15-15m100 0 15 15 15-15"/><path fill="none" d="M25 65h65m60 0h65"/>'
        ], [
            'Stripy sneakers', '<path fill="#69c8b5" d="M25 30h60v45q35 0 35 40H5q0-40 20-40zm130 0h60v45q20 0 20 40H120q0-40 35-40z"/><path fill="none" stroke="white" d="m40 60 30 10m-30 5 30 10m100-25 30 10m-30 5 30 10"/>'
        ]
    ]
};
// These body choices are read in order; saved games remember their array index.
// Keep this order if you want old saves to keep the same body.
const bodyOptions = [
    {
        name: 'Classic', src: 'media/toy-body.png'
    },
    {
        name: 'Golden', src: sticker('<path fill="#efb65b" d="M55 20Q105-5 120 55l25 160q10 80-65 80T15 215L30 70Q30 30 55 20z"/><g stroke="#ca8f3f" stroke-width="4"><path d="m55 70 4 4m40 50 4 4m-65 50 4 4m60 50 4 4m-45 25 4 4"/></g>', 160, 310)
    },
    {
        name: 'Sweet potato', src: sticker('<path fill="#dc849f" d="M85 10q60 20 45 100l15 100q5 85-65 90T20 205L35 90Q35 25 85 10z"/><path stroke="#b55f80" stroke-width="4" d="m65 50-8 20m45 35-8 20m-40 40-8 20m50 40-8 20m-35 20-8 10"/>', 160, 310)
    },
    {
        name: 'Round spud', src: sticker('<path fill="#c99866" d="M80 25q70-10 70 100v70q0 105-70 100T10 195v-70Q10 35 80 25z"/><path stroke="#a6794c" stroke-width="4" d="m40 80 5 4m65 50 5 4m-80 65 5 4m60 55 5 4"/>', 160, 310)
    }
];

export {options, sticker, bodyOptions};
