var game1 = new Chess("6k1/rn3p1p/2p1p1p1/1P1p2P1/1QPPq3/7P/r4RPK/5R2 w - - 0 1");

var solutionMoves1 = [
  "Qf8+", "Kxf8",
  "Rxf7+", "Ke8",
  "Rf8+", "Kd7",
  "R1f7+", "Kd6",
  "Rd8+", "Nxd8",
  "c5#"
];

var currentStep1 = 0;
var checkpoints1 = [game1.fen()];
var lastMove1 = null;

// ⏱ Chess clock
var whiteSecs1 = 0, blackSecs1 = 0;
var whiteMins1 = 3, blackMins1 = 3;
var activeClock1 = "w"; 
var isPaused1 = false;
var clockInterval1 = setInterval(updateClock1, 1000);

function updateClock1() {
  if (isPaused1 || game1.game_over()) return;

  if (activeClock1 === "w") {
    document.getElementById("whiteClock").classList.add('active1');
    document.getElementById("blackClock").classList.remove('active1');

    if (whiteSecs1 === 0) {
      if (whiteMins1 === 0) {
        endGame1("Black wins on time!");
        return;
      }
      whiteMins1--;
      whiteSecs1 = 59;
    } else {
      whiteSecs1--;
    }
  } else {
    document.getElementById("whiteClock").classList.remove('active1');
    document.getElementById("blackClock").classList.add('active1');

    if (blackSecs1 === 0) {
      if (blackMins1 === 0) {
        endGame1("White wins on time!");
        return;
      }
      blackMins1--;
      blackSecs1 = 59;
    } else {
      blackSecs1--;
    }
  }

  document.getElementById("whiteClock").innerText = 
    "White: " + whiteMins1.toString().padStart(2, "0") + ":" + whiteSecs1.toString().padStart(2, "0") + "s";
  document.getElementById("blackClock").innerText = 
    "Black: " + blackMins1.toString().padStart(2, "0") + ":" + blackSecs1.toString().padStart(2, "0") + "s";
}

function switchClock1() { 
  activeClock1 = (activeClock1 === "w") ? "b" : "w"; 
}

function endGame1(msg) { 
  clearInterval(clockInterval1); 
  console.log(msg); 
}

// 🎯 Toggle pause/resume on clock click
document.getElementById("whiteClock").addEventListener("click", togglePause1);
document.getElementById("blackClock").addEventListener("click", togglePause1);

function togglePause1() {
  isPaused1 = !isPaused1;
  if (isPaused1) {
    document.getElementById("whiteClock").classList.remove('active1');
    document.getElementById("blackClock").classList.remove('active1');
  }
  console.log(isPaused1 ? "⏸️ Paused" : "▶️ Resumed");
}

// 🔊 Sounds
function playSound1(type) {
  let sound = document.getElementById(type + "Sound");
  if (sound) { sound.currentTime = 0; sound.play(); }
}

// 🌟 Highlight helpers
function clearTempHighlights1() {
  $('#board .square-55d63').removeClass('highlight square-error');
}

function highlightSquare1(square, cssClass, color) {
  let $sq = $('#board .square-' + square);
  $sq.addClass(cssClass);
  if (color) $sq.css("background", color);
}

function normalizeSAN1(san) { return san.replace(/[+#]/g, ''); }

function highlightMoves1(square) {
  clearTempHighlights1();
  var moves = game1.moves({ square: square, verbose: true });
  if (moves.length === 0) return;
  highlightSquare1(square, "highlight", "#98abd0");
  moves.forEach(m => {
    highlightSquare1(m.to, "highlight", m.captured ? "#cadafe" : "#ffffff");
  });
}

function applyLastMoveHighlight1() {
  if (!lastMove1) return;
  $('#board .square-' + lastMove1.from).addClass("last-move-from");
  $('#board .square-' + lastMove1.to).addClass("last-move-to");
}

// ♟ Events
function onDragStart1(source, piece) {
  if (game1.game_over()) return false;
  if (piece.startsWith('b')) return false;
  highlightMoves1(source);
}

function onDrop1(source, target) {
  clearTempHighlights1();
  var move = game1.move({ from: source, to: target, promotion: 'q' });

  if (move === null) {
    return 'snapback';
  }

  playSound1(move.captured ? "capture" : "move");
  if (move.san.includes("+")) playSound1("check");

  lastMove1 = { from: move.from, to: move.to };

  var san = move.san, expected = solutionMoves1[currentStep1];
  if (normalizeSAN1(san) === normalizeSAN1(expected)) {
    currentStep1++; checkpoints1[currentStep1] = game1.fen(); switchClock1();
    
    if (currentStep1 % 2 === 1) {
      let whiteSteps = Math.ceil(solutionMoves1.length / 2);
      let playerProgress = Math.ceil(currentStep1 / 2);
      updateProgressBar1(playerProgress, whiteSteps);
    }

    if (currentStep1 < solutionMoves1.length) {
      var expectedBlackMove = solutionMoves1[currentStep1];
      setTimeout(() => {
        var legalMoves = game1.moves(), blackMove = null;
        for (var i = 0; i < legalMoves.length; i++) {
          if (normalizeSAN1(legalMoves[i]) === normalizeSAN1(expectedBlackMove)) {
            blackMove = game1.move(legalMoves[i]); break;
          }
        }
        if (blackMove) {
          playSound1(blackMove.captured ? "capture" : "move");
          if (blackMove.san.includes("+")) playSound1("check");
          lastMove1 = { from: blackMove.from, to: blackMove.to };
          board1.position(game1.fen(), true);
          currentStep1++; checkpoints1[currentStep1] = game1.fen(); switchClock1();
        }
      }, 800);
    }

    if (currentStep1 === solutionMoves1.length) {
      setTimeout(() => {
        playSound1("mate"); endGame1("Checkmate!");
        var boardObj = game1.board();
        for (var r = 0; r < 8; r++) {
          for (var c = 0; c < 8; c++) {
            var piece = boardObj[r][c];
            if (piece && piece.type === "k") {
              var sq = "abcdefgh"[c] + (8-r);
              if (piece.color === "w") highlightSquare1(sq, "winner", "#98abd0");
              else highlightSquare1(sq, "loser", "#000000");
            }
          }
        }
      }, 1000);
    }
  } else {
    playSound1("incorrect");
    var $sq = $('#board .square-' + source);
    $sq.addClass("square-error");
    setTimeout(() => {
      $sq.removeClass("square-error");
      var lastFen = checkpoints1[currentStep1];
      game1.load(lastFen);
      board1.position(lastFen, true);
    }, 500);
  }
}

function onSnapEnd1() {
  board1.position(game1.fen());
  applyLastMoveHighlight1();
}

var board1 = Chessboard('board', {
  draggable: true,
  position: game1.fen(),
  onDragStart: onDragStart1,
  onDrop: onDrop1,
  onSnapEnd: onSnapEnd1
});

$('#board').on('click', '.square-55d63', function() {
  var sq = $(this).attr('class').split(' ')
    .filter(c => c.startsWith('square-'))[0]
    .split('-')[1];
  highlightMoves1(sq);
});






var c1 = document.getElementById("c");
var ctx1 = c1.getContext("2d");
var cH1, cW1;
var constellationParticles1 = [];
var stars1 = [];
var mouse1 = { x: null, y: null };

var dayColor1 = { r: 135, g: 206, b: 235 }; // sky blue
var nightColor1 = { r: 10, g: 10, b: 42 };  // dark blue
var currentBg1 = { ...nightColor1 };
var targetBg1 = { ...nightColor1 };
var isNight1 = true;

// 🌙/☀️ Puzzle element
var puzzle1 = document.querySelector(".main__puzzle");

// 🔵 Circle helper
function extend1(a, b){ for(var key in b){ if(b.hasOwnProperty(key)) a[key]=b[key]; } return a; }
var Circle1 = function(opts){ extend1(this, opts); }
Circle1.prototype.draw = function() {
  ctx1.globalAlpha = this.opacity || 1;
  ctx1.beginPath();
  ctx1.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
  if (this.fill) {
    ctx1.fillStyle = this.fill;
    ctx1.fill();
  }
  ctx1.closePath();
  ctx1.globalAlpha = 1;
};

// ✨ Constellation Particles
function ConstellationParticle1() {
  this.x = Math.random() * cW1;
  this.y = Math.random() * cH1;
  this.vx = (Math.random() - 0.5) * 0.6;
  this.vy = (Math.random() - 0.5) * 0.6;
  this.radius = 2;
}
ConstellationParticle1.prototype.draw = function() {
  ctx1.beginPath();
  ctx1.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
  ctx1.fillStyle = "#fff";
  ctx1.fill();
};

// ⭐ Moving Stars
function Star1() {
  this.x = Math.random() * cW1;
  this.y = Math.random() * cH1 * 0.7;
  this.size = Math.random() * 2 + 1;
  this.speed = Math.random() * 0.2 + 0.05;
}
Star1.prototype.draw = function() {
  ctx1.beginPath();
  ctx1.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  ctx1.fillStyle = "white";
  ctx1.fill();
};
Star1.prototype.update = function() {
  this.x -= this.speed;
  if (this.x < 0) {
    this.x = cW1;
    this.y = Math.random() * cH1 * 0.7;
  }
  this.draw();
};

// ⭐ Draw constellation connections
function drawConstellation1() {
  for (let i = 0; i < constellationParticles1.length; i++) {
    let p1 = constellationParticles1[i];

    p1.x += p1.vx; 
    p1.y += p1.vy;
    if (p1.x < 0 || p1.x > cW1) p1.vx *= -1;
    if (p1.y < 0 || p1.y > cH1) p1.vy *= -1;

    if (mouse1.x !== null && mouse1.y !== null) {
      let dx1 = mouse1.x - p1.x;
      let dy1 = mouse1.y - p1.y;
      let dist1 = Math.sqrt(dx1*dx1 + dy1*dy1);
      if (dist1 < 120) {
        p1.x += dx1 * 0.01;
        p1.y += dy1 * 0.01;
      }
    }

    p1.draw();

    for (let j = i + 1; j < constellationParticles1.length; j++) {
      let q1 = constellationParticles1[j];
      let dx1 = p1.x - q1.x, dy1 = p1.y - q1.y;
      let dist1 = Math.sqrt(dx1*dx1 + dy1*dy1);
      if (dist1 < 120) {
        ctx1.beginPath();
        ctx1.strokeStyle = "rgba(255,255,255," + (1 - dist1 / 120) + ")";
        ctx1.lineWidth = 1;
        ctx1.moveTo(p1.x, p1.y);
        ctx1.lineTo(q1.x, q1.y);
        ctx1.stroke();
      }
    }
  }
}

// 🎬 Animation loop
var animateLoop1 = anime({
  duration: Infinity,
  update: function() {
    // Smooth background fade
    currentBg1.r = lerp1(currentBg1.r, targetBg1.r, 0.01);
    currentBg1.g = lerp1(currentBg1.g, targetBg1.g, 0.01);
    currentBg1.b = lerp1(currentBg1.b, targetBg1.b, 0.01);
    ctx1.fillStyle = `rgb(${Math.round(currentBg1.r)},${Math.round(currentBg1.g)},${Math.round(currentBg1.b)})`;
    ctx1.fillRect(0, 0, cW1, cH1);

    // Stars always visible
    stars1.forEach(star1 => star1.update());

    // Constellations only at night
    if (isNight1) drawConstellation1();
  }
});

// 🖥 Resize
function resizeCanvas1() {
  cW1 = window.innerWidth * 0.4;
  cH1 = window.innerHeight;
  c1.width = cW1 * devicePixelRatio;
  c1.height = cH1 * devicePixelRatio;
  ctx1.setTransform(1, 0, 0, 1, 0, 0); // reset transform
  ctx1.scale(devicePixelRatio, devicePixelRatio);
}
window.addEventListener("resize", resizeCanvas1);

// 🚀 Init
(function init1() {
  resizeCanvas1();
  for (let i = 0; i < 80; i++) constellationParticles1.push(new ConstellationParticle1());
  for (let i = 0; i < 120; i++) stars1.push(new Star1());

  // floating + rotation animation for puzzle
  anime({
    targets: puzzle1,
    translateY: ["-10px", "10px"],
    rotate: ["-5deg", "5deg"],
    direction: "alternate",
    loop: true,
    easing: "easeInOutSine",
    duration: 6000
  });

  // toggle day/night
  setInterval(() => {
    isNight1 = !isNight1;
    targetBg1 = isNight1 ? nightColor1 : dayColor1;

    // fade transition for puzzle
    puzzle1.style.transition = "opacity 2s";
    puzzle1.style.opacity = 0;
    setTimeout(() => {
      puzzle1.classList.toggle("sun__class", !isNight1);
      puzzle1.classList.toggle("moon__class", isNight1);
      puzzle1.style.opacity = 1;
    }, 2000);
  }, 20000);
})();

// 🖱️ Events
c1.addEventListener("mousemove", function(e) {
  var rect1 = c1.getBoundingClientRect();
  mouse1.x = e.clientX - rect1.left;
  mouse1.y = e.clientY - rect1.top;
});
c1.addEventListener("mouseleave", function() {
  mouse1.x = null;
  mouse1.y = null;
});

// 🔧 Helpers
function lerp1(a, b, t) {
  return a + (b - a) * t;
}

const progressFill1 = document.querySelector(".progress-fill");
const particleCanvas1 = document.getElementById("progressParticles");
const pctx1 = particleCanvas1.getContext("2d");

let pW1 = particleCanvas1.width = 20;
let pH1 = particleCanvas1.height = window.innerHeight;
let particles1 = [];

// Resize canvas with window
window.addEventListener("resize", () => {
  pH1 = particleCanvas1.height = window.innerHeight;
});

// Particle system
class Particle1 {
  constructor(x, y, color, burst = false) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * (burst ? 6 : 2);
    this.vy = (Math.random() - 0.5) * (burst ? 6 : 2);
    this.size = Math.random() * 2 + 1;
    this.alpha = 1;
    this.color = color;
    this.decay = 0.02 + Math.random() * 0.02;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
    return this.alpha > 0;
  }
  draw(ctx1) {
    ctx1.globalAlpha = this.alpha;
    ctx1.beginPath();
    ctx1.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx1.fillStyle = this.color;
    ctx1.fill();
    ctx1.globalAlpha = 1;
  }
}

// Animation loop
function animateParticles1() {
  pctx1.clearRect(0, 0, pW1, pH1);
  particles1 = particles1.filter(p1 => p1.update());
  particles1.forEach(p1 => p1.draw(pctx1));
  requestAnimationFrame(animateParticles1);
}
animateParticles1();

// Progress update function
function updateProgressBar1(step1, totalSteps1) {
  const progress1 = step1 / totalSteps1;
  const percent1 = Math.min(progress1 * 100, 100);
  progressFill1.style.height = percent1 + "%";

  const tipY1 = pH1 - (percent1 / 100) * pH1;
  const tipX1 = pW1 / 2;

  // Burst at checkpoint
  for (let i = 0; i < 15; i++) {
    particles1.push(new Particle1(tipX1, tipY1, "rgba(255,255,255,0.9)", true));
  }
}

// Gentle sparks at the tip
setInterval(() => {
  const percent1 = parseFloat(progressFill1.style.height) / 100;
  if (percent1 > 0 && percent1 <= 1) {
    const tipY1 = pH1 - (percent1 * pH1);
    const tipX1 = pW1 / 2;
    particles1.push(new Particle1(tipX1, tipY1, "rgba(0,242,254,0.7)", false));
  }
}, 80);
