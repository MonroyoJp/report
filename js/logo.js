function playLogoAnimation() {
  const logoAnimation = anime.timeline({
    autoplay: true,
    delay: 200
  });

  // Forward animation
  logoAnimation
  .add({
    targets: '#logo',
    translateY: [-100, 0],
    opacity: [0, 1],
    elasticity: 600,
    duration: 1600
  })
  .add({
    targets: '#logo-hexagon',
    rotate: [-90, 0],
    duration: 1200,
    elasticity: 600,
    offset: 100
  })
  .add({
    targets: '#logo-circle',
    scale: [0, 1],
    duration: 1200,
    elasticity: 600,
    offset: 500
  })
  .add({
    targets: '#logo-mask',
    scale: [0, 1],
    duration: 1000,
    elasticity: 600,
    offset: 550
  })
  .add({
    targets: '#logo-text',
    translateX: ['-100%', 0],
    opacity: [0, 1],
    duration: 1000,
    easing: 'easeOutExpo',
    offset: 1000,
    complete: () => {
      // Wait ~8s then reverse faster
      setTimeout(() => {
        anime.timeline({
          autoplay: true
        })
        .add({
          targets: ['#logo-text'],
          translateX: [0, '-100%'],
          opacity: [1, 0],
          duration: 600, // faster reverse
          easing: 'easeInExpo'
        })
        .add({
          targets: ['#logo-mask'],
          scale: [1, 0],
          duration: 500,
          offset: 100
        })
        .add({
          targets: ['#logo-circle'],
          scale: [1, 0],
          duration: 500,
          offset: 150
        })
        .add({
          targets: ['#logo-hexagon'],
          rotate: [0, -90],
          duration: 600,
          offset: 200
        })
        .add({
          targets: ['#logo'],
          translateY: [0, -100],
          opacity: [1, 0],
          duration: 800,
          easing: 'easeInExpo',
          offset: 250,
          complete: () => {
            // Restart the whole forward animation
            playLogoAnimation();
          }
        });
      }, 8000); // keep visible for 8s before reversing
    }
  });
}

playLogoAnimation();
