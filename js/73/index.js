const canvas = document.querySelector('#theCanvas');
const context = canvas.getContext('2d');
const size = 64;
let segments, direction, nextDirection, apple, score, speed, timer, running = false, audio;
const vectors = {ArrowRight:[1,0],ArrowLeft:[-1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
const appleImage = new Image(); appleImage.src = 'apple.svg'; appleImage.onload = () => { if (segments) draw(); };
function sound(frequency) {
    if (!audio) return;
    const oscillator = audio.createOscillator(), gain = audio.createGain();
    oscillator.frequency.value = frequency; gain.gain.setValueAtTime(.08,audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.18);
    oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(); oscillator.stop(audio.currentTime+.2);
}
function placeApple() {
    const free = [];
    for (let x=0; x<canvas.width; x+=size) for (let y=0; y<canvas.height; y+=size)
        if (!segments.some(piece => piece.x === x && piece.y === y)) free.push({x,y});
    apple = free.length ? free[Math.floor(Math.random()*free.length)] : null;
}
function draw() {
    context.clearRect(0,0,canvas.width,canvas.height);
    segments.forEach((piece,index) => { context.fillStyle = index ? '#3f9c55' : '#165d31'; context.fillRect(piece.x+2,piece.y+2,size-4,size-4); });
    if (apple) {
        if (appleImage.complete && appleImage.naturalWidth) context.drawImage(appleImage,apple.x,apple.y,size,size);
        else { context.fillStyle = 'red'; context.fillRect(apple.x+12,apple.y+12,40,40); }
    }
}
function finish(message) { running = false; clearTimeout(timer); document.querySelector('#status').textContent = `${message} Score: ${score}.`; }
function tick() {
    if (!running) return;
    direction = nextDirection;
    const [dx,dy] = vectors[direction];
    const head = {x:segments[0].x+dx*size,y:segments[0].y+dy*size};
    const eating = apple && head.x === apple.x && head.y === apple.y;
    const body = eating ? segments : segments.slice(0,-1);
    if (head.x<0 || head.y<0 || head.x>=canvas.width || head.y>=canvas.height || body.some(p=>p.x===head.x&&p.y===head.y)) {
        sound(90); finish('Game over'); return;
    }
    segments.unshift(head);
    if (eating) { score++; speed = Math.max(70,speed*.95); sound(650); placeApple(); }
    else segments.pop();
    draw();
    if (!apple) { finish('You filled the board!'); return; }
    document.querySelector('#status').textContent = `Score: ${score}`;
    timer = setTimeout(tick,speed);
}
document.querySelector('#start').addEventListener('click', () => {
    clearTimeout(timer);
    try { audio ||= new AudioContext(); audio.resume().catch(()=>{}); } catch { /* Game still works without audio. */ }
    segments = [{x:128,y:192}]; direction = nextDirection = 'ArrowRight'; score = 0; speed = 350; running = true;
    placeApple(); draw(); document.querySelector('#status').textContent = 'Score: 0'; timer = setTimeout(tick,speed);
});
window.addEventListener('keydown',event => {
    if (!vectors[event.key] || !running) return;
    event.preventDefault();
    const [dx,dy] = vectors[direction], [nx,ny] = vectors[event.key];
    if (dx+nx !== 0 || dy+ny !== 0) nextDirection = event.key;
});
