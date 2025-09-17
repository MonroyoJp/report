var c5 = document.getElementById("c");
var ctx5 = c5.getContext("2d");
var cH5;
var cW5;
var bgColor5 = "#FF6138";
var animations5 = [];
var circles5 = [];

var colorPicker5 = (function() {
  var colors5 = ["#FF6138", "#FFBE53", "#2980B9", "#282741"];
  var index5 = 0;
  function next5() {
    index5 = index5++ < colors5.length - 1 ? index5 : 0;
    return colors5[index5];
  }
  function current5() {
    return colors5[index5];
  }
  return {
    next: next5,
    current: current5
  }
})();

function removeAnimation5(animation5) {
  var index5 = animations5.indexOf(animation5);
  if (index5 > -1) animations5.splice(index5, 1);
}

function calcPageFillRadius5(x5, y5) {
  var l5 = Math.max(x5 - 0, cW5 - x5);
  var h5 = Math.max(y5 - 0, cH5 - y5);
  return Math.sqrt(Math.pow(l5, 2) + Math.pow(h5, 2));
}

function addClickListeners5() {
  document.addEventListener("touchstart", handleEvent5);
  document.addEventListener("mousedown", handleEvent5);
};

function handleEvent5(e5) {
  if (e5.touches) { 
    e5.preventDefault();
    e5 = e5.touches[0];
  }
  var currentColor5 = colorPicker5.current();
  var nextColor5 = colorPicker5.next();
  var targetR5 = calcPageFillRadius5(e5.pageX, e5.pageY);
  var rippleSize5 = Math.min(200, (cW5 * .4));
  var minCoverDuration5 = 750;
  
  var pageFill5 = new Circle5({
    x: e5.pageX,
    y: e5.pageY,
    r: 0,
    fill: nextColor5
  });
  var fillAnimation5 = anime({
    targets: pageFill5,
    r: targetR5,
    duration:  Math.max(targetR5 / 2 , minCoverDuration5 ),
    easing: "easeOutQuart",
    complete: function(){
      bgColor5 = pageFill5.fill;
      removeAnimation5(fillAnimation5);
    }
  });
  
  var ripple5 = new Circle5({
    x: e5.pageX,
    y: e5.pageY,
    r: 0,
    fill: currentColor5,
    stroke: {
      width: 3,
      color: currentColor5
    },
    opacity: 1
  });
  var rippleAnimation5 = anime({
    targets: ripple5,
    r: rippleSize5,
    opacity: 0,
    easing: "easeOutExpo",
    duration: 900,
    complete: removeAnimation5
  });
  
  var particles5 = [];
  for (var i5 = 0; i5 < 32; i5++) {
    var particle5 = new Circle5({
      x: e5.pageX,
      y: e5.pageY,
      fill: currentColor5,
      r: anime.random(24, 48)
    })
    particles5.push(particle5);
  }
  var particlesAnimation5 = anime({
    targets: particles5,
    x: function(particle5){
      return particle5.x + anime.random(rippleSize5, -rippleSize5);
    },
    y: function(particle5){
      return particle5.y + anime.random(rippleSize5 * 1.15, -rippleSize5 * 1.15);
    },
    r: 0,
    easing: "easeOutExpo",
    duration: anime.random(1000,1300),
    complete: removeAnimation5
  });
  animations5.push(fillAnimation5, rippleAnimation5, particlesAnimation5);
}

function extend5(a5, b5){
  for(var key5 in b5) {
    if(b5.hasOwnProperty(key5)) {
      a5[key5] = b5[key5];
    }
  }
  return a5;
}

var Circle5 = function(opts5) {
  extend5(this, opts5);
}

Circle5.prototype.draw = function() {
  ctx5.globalAlpha = this.opacity || 1;
  ctx5.beginPath();
  ctx5.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
  if (this.stroke) {
    ctx5.strokeStyle = this.stroke.color;
    ctx5.lineWidth = this.stroke.width;
    ctx5.stroke();
  }
  if (this.fill) {
    ctx5.fillStyle = this.fill;
    ctx5.fill();
  }
  ctx5.closePath();
  ctx5.globalAlpha = 1;
}

var animate5 = anime({
  duration: Infinity,
  update: function() {
    ctx5.fillStyle = bgColor5;
    ctx5.fillRect(0, 0, cW5, cH5);
    animations5.forEach(function(anim5) {
      anim5.animatables.forEach(function(animatable5) {
        animatable5.target.draw();
      });
    });
  }
});

var resizeCanvas5 = function() {
  cW5 = window.innerWidth;
  cH5 = window.innerHeight;
  c5.width = cW5 * devicePixelRatio;
  c5.height = cH5 * devicePixelRatio;
  ctx5.scale(devicePixelRatio, devicePixelRatio);
};

(function init5() {
  resizeCanvas5();
  if (window.CP) {
    window.CP.PenTimer.MAX_TIME_IN_LOOP_WO_EXIT = 6000; 
  }
  window.addEventListener("resize", resizeCanvas5);
  addClickListeners5();
  if (!!window.location.pathname.match(/fullcpgrid/)) {
    startFauxClicking5();
  }
  handleInactiveUser5();
})();

function handleInactiveUser5() {
  var inactive5 = setTimeout(function(){
    fauxClick5(cW5/2, cH5/2);
  }, 2000);
  
  function clearInactiveTimeout5() {
    clearTimeout(inactive5);
    document.removeEventListener("mousedown", clearInactiveTimeout5);
    document.removeEventListener("touchstart", clearInactiveTimeout5);
  }
  
  document.addEventListener("mousedown", clearInactiveTimeout5);
  document.addEventListener("touchstart", clearInactiveTimeout5);
}

function startFauxClicking5() {
  setTimeout(function(){
    fauxClick5(anime.random( cW5 * .2, cW5 * .8), anime.random(cH5 * .2, cH5 * .8));
    startFauxClicking5();
  }, anime.random(200, 900));
}

function fauxClick5(x5, y5) {
  var fauxClick5 = new Event("mousedown");
  fauxClick5.pageX = x5;
  fauxClick5.pageY = y5;
  document.dispatchEvent(fauxClick5);
}
