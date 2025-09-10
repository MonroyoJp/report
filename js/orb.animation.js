const orbCanvas = document.getElementById("orbCanvas");
const orbCtx = orbCanvas.getContext("2d");

function resizeCanvas() {
  orbCanvas.width = window.innerWidth;
  orbCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// define orb state globally
window.orb = {
  radius: 200,
  opacity: 1
};

function drawWavyPath(ctx, centerX, centerY, radius, time, offsetScale = 1) {
  ctx.beginPath();
  for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
    let offset = Math.sin(angle * 4 + time * 0.002) * 15 * offsetScale;
    let x = centerX + Math.cos(angle) * (radius + offset);
    let y = centerY + Math.sin(angle) * (radius + offset);
    if (angle === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
}

function drawOrb(time) {
  orbCtx.clearRect(0, 0, orbCanvas.width, orbCanvas.height);

  const centerX = orbCanvas.width / 2;
  const centerY = orbCanvas.height / 2;
  const radius = window.orb.radius;

  // ===== Main orb body =====
  orbCtx.fillStyle = `rgba(0, 180, 255, ${0.8 * window.orb.opacity})`;
  drawWavyPath(orbCtx, centerX, centerY, radius, time, 1);
  orbCtx.fill();

  // ===== Reflection (mirrored orb) =====
  orbCtx.save();
  orbCtx.translate(0, centerY * 2 + radius); // move below orb
  orbCtx.scale(1, -1); // flip vertically

  // Use gradient fade
  const reflectionGradient = orbCtx.createLinearGradient(0, centerY, 0, centerY + radius * 0.2);
  reflectionGradient.addColorStop(0, `rgba(0, 179, 255, 0.05)`);
  reflectionGradient.addColorStop(1, "rgba(0, 180, 255, 0)");

  orbCtx.fillStyle = reflectionGradient;
  drawWavyPath(orbCtx, centerX, centerY, radius, time, 1);
  orbCtx.fill();
  orbCtx.restore();
}

function animateOrb(time) {
  requestAnimationFrame(animateOrb);
  drawOrb(time);
}

animateOrb();