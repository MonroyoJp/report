const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];
const numberOfParticles = 120;

let mouse = { x: null, y: null, radius: 120 };

// Mouse tracking
window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

// Color interpolation helper
function lerpColor(a, b, t) {
  const ar = parseInt(a.substr(1, 2), 16),
    ag = parseInt(a.substr(3, 2), 16),
    ab = parseInt(a.substr(5, 2), 16);

  const br = parseInt(b.substr(1, 2), 16),
    bg = parseInt(b.substr(3, 2), 16),
    bb = parseInt(b.substr(5, 2), 16);

  const rr = Math.round(ar + (br - ar) * t),
    rg = Math.round(ag + (bg - ag) * t),
    rb = Math.round(ab + (bb - ab) * t);

  return `rgb(${rr},${rg},${rb})`;
}

// =====================
//  Glow Orb Class
// =====================
class GlowOrb {
  constructor(x, y, radius, speed, alpha) {
    this.x = x;
    this.y = y;
    this.baseRadius = radius;
    this.radius = radius;
    this.speed = speed;
    this.alpha = alpha;
    this.offset = Math.random() * Math.PI * 2;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.radius
    );
    gradient.addColorStop(0, `rgba(19, 235, 255, ${this.alpha})`);
    gradient.addColorStop(1, "rgba(19, 235, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  update() {
    this.radius =
      this.baseRadius +
      Math.sin(Date.now() * this.speed + this.offset) * (this.baseRadius * 0.3);
    this.draw();
  }
}

// =====================
//  Particle Class
// =====================
class Particle2 {
  constructor(x, y, dx, dy, size) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.size = size;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    const t = (Math.sin(Date.now() / 1000 + this.y / 200) + 1) / 2;
    ctx.globalAlpha = 0.4; 
    ctx.fillStyle = lerpColor("#13ebff", "#ff3b7a", t);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }

  update() {
    if (this.x + this.size > canvas.width || this.x - this.size < 0)
      this.dx = -this.dx;
    if (this.y + this.size > canvas.height || this.y - this.size < 0)
      this.dy = -this.dy;

    this.x += this.dx;
    this.y += this.dy;

    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius) {
      this.x -= dx / 20;
      this.y -= dy / 20;
    }

    this.draw();
  }
}

// =====================
// Small Dot Class
// =====================
class SmallDot {
  constructor(x, y, size, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speedX = speedX;
    this.speedY = speedY;
    this.alpha = Math.random() * 0.5 + 0.2; // faint transparency
    this.offset = Math.random() * Math.PI * 2;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.fill();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // wrap around edges
    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;

    // twinkling alpha
    this.alpha =
      0.3 + Math.sin(Date.now() * 0.002 + this.offset) * 0.2;

    this.draw();
  }
}

// =====================
// Initialize Arrays
// =====================
for (let i = 0; i < numberOfParticles; i++) {
  let size = 2;
  let x = Math.random() * canvas.width;
  let y = Math.random() * canvas.height;
  let dx = (Math.random() - 0.5) * 1;
  let dy = (Math.random() - 0.5) * 1;
  particlesArray.push(new Particle2(x, y, dx, dy, size));
}

const glowOrbs = [];
for (let i = 0; i < 10; i++) {
  let x = Math.random() * canvas.width;
  let y = Math.random() * canvas.height;
  let radius = 80 + Math.random() * 60;
  let speed = 0.002 + Math.random() * 0.002;
  let alpha = 0.08 + Math.random() * 0.05;
  glowOrbs.push(new GlowOrb(x, y, radius, speed, alpha));
}

const smallDots = [];
for (let i = 0; i < 50; i++) {
  let x = Math.random() * canvas.width;
  let y = Math.random() * canvas.height;
  let size = Math.random() * 1.5 + 0.5; // very small
  let speedX = (Math.random() - 0.5) * 0.2;
  let speedY = (Math.random() - 0.5) * 0.2;
  smallDots.push(new SmallDot(x, y, size, speedX, speedY));
}

// =====================
// Connect Particles
// =====================
function connectParticles() {
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let dx = particlesArray[a].x - particlesArray[b].x;
      let dy = particlesArray[a].y - particlesArray[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        ctx.beginPath();
        const avgY = (particlesArray[a].y + particlesArray[b].y) / 2;
        const t = (Math.sin(Date.now() / 1000 + avgY / 200) + 1) / 2;
        ctx.strokeStyle = lerpColor("#13ebff", "#ff3b7a", t);
        ctx.lineWidth = 0.5;
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
}

// =====================
// Animation Loop
// =====================
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  glowOrbs.forEach((orb) => orb.update());     // big glowing circles
  smallDots.forEach((dot) => dot.update());    // twinkling dots
  particlesArray.forEach((p) => p.update());   // network particles
  connectParticles();                          // lines
}

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
