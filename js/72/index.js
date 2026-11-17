const canvas = document.querySelector('#theCanvas');
const context = canvas.getContext('2d');
const balls = [];
class Ball {
    constructor(color, radius) {
        this.color = color; this.radius = radius;
        this.x = radius + Math.random() * (canvas.width - 2 * radius);
        this.y = radius + Math.random() * (canvas.height - 2 * radius);
        this.dx = 100 + Math.random() * 120; this.dy = 120;
    }
    move(dt, gravity) {
        if (gravity) this.dy += 500 * dt;
        this.x += this.dx * dt; this.y += this.dy * dt;
        if (this.x < this.radius) { this.x = this.radius; this.dx = Math.abs(this.dx); }
        if (this.x > canvas.width - this.radius) { this.x = canvas.width - this.radius; this.dx = -Math.abs(this.dx); }
        if (this.y < this.radius) { this.y = this.radius; this.dy = Math.abs(this.dy); }
        if (this.y > canvas.height - this.radius) {
            this.y = canvas.height - this.radius; this.dy = -Math.abs(this.dy) * (gravity ? .8 : 1);
            if (gravity) { this.dx *= .92; if (Math.abs(this.dy) < 12) this.dy = 0; }
        }
    }
    draw() {
        context.beginPath(); context.fillStyle = this.color;
        context.arc(this.x,this.y,this.radius,0,Math.PI*2); context.fill();
    }
}
document.querySelector('#add-ball').addEventListener('submit', event => {
    event.preventDefault();
    const radius = Number(document.querySelector('#radius').value);
    if (!Number.isFinite(radius) || radius < 5 || radius > 100) return;
    balls.push(new Ball(document.querySelector('#color').value,radius));
    document.querySelector('#status').textContent = `${balls.length} balls bouncing.`;
});
document.querySelector('#clear').addEventListener('click', () => { balls.length = 0; document.querySelector('#status').textContent = 'Balls cleared.'; });
let previous;
function frame(time) {
    const dt = previous === undefined ? 0 : Math.min((time - previous)/1000,.04); previous = time;
    context.clearRect(0,0,canvas.width,canvas.height);
    for (const ball of balls) { ball.move(dt,document.querySelector('#gravity').checked); ball.draw(); }
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
export {Ball};
