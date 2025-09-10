const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];
const numberOfParticles = 120;

let mouse = {
  x: null,
  y: null,
  radius: 120 // influence radius
};

// Track mouse position
window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

// Particle class
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
    ctx.fillStyle = "rgba(0, 200, 255, 0.8)";
    ctx.fill();
  }

  update() {
    // Bounce off walls
    if (this.x + this.size > canvas.width || this.x - this.size < 0) this.dx = -this.dx;
    if (this.y + this.size > canvas.height || this.y - this.size < 0) this.dy = -this.dy;

    // Move particle
    this.x += this.dx;
    this.y += this.dy;

    // Interaction with mouse
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius) {
      // push away from mouse
      this.x -= dx / 20;
      this.y -= dy / 20;
    }

    this.draw();
  }
}

// Initialize particles
for (let i = 0; i < numberOfParticles; i++) {
  let size = 2;
  let x = Math.random() * canvas.width;
  let y = Math.random() * canvas.height;
  let dx = (Math.random() - 0.5) * 1;
  let dy = (Math.random() - 0.5) * 1;
  particlesArray.push(new Particle2(x, y, dx, dy, size));
}

// Draw lines between particles
function connectParticles() {
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let dx = particlesArray[a].x - particlesArray[b].x;
      let dy = particlesArray[a].y - particlesArray[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 200, 255," + (1 - distance / 120) + ")";
        ctx.lineWidth = 0.5;
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => p.update());
  connectParticles();
}

animate();

// Resize support
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
