// Animate circles
  anime({
    targets: '.circle-1',
    translateY: -24,
    translateX: 52,
    direction: 'alternate',
    loop: true,
    elasticity: 400,
    easing: 'easeInOutElastic',
    duration: 1600,
    delay: 800,
  });

  anime({
    targets: '.circle-2',
    translateY: 24,
    direction: 'alternate',
    loop: true,
    elasticity: 400,
    easing: 'easeInOutElastic',
    duration: 1600,
    delay: 800,
  });

  anime({
    targets: '.circle-3',
    translateY: -24,
    direction: 'alternate',
    loop: true,
    elasticity: 400,
    easing: 'easeInOutElastic',
    duration: 1600,
    delay: 800,
  });

  anime({
    targets: '.circle-4',
    translateY: 24,
    translateX: -52,
    direction: 'alternate',
    loop: true,
    elasticity: 400,
    easing: 'easeInOutElastic',
    duration: 1600,
    delay: 800,
  });

  // Hide preloader when fully loaded
  window.addEventListener("load", function() {
    document.getElementById("preloader").style.display = "none";
    if (typeof togglePause1 === "function") {
      togglePause1();
    }
  });