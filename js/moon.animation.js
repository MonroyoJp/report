const phases = [
  "circle(50% at 50% 50%)",               //  Full moon
  "ellipse(25% 50% at 60% 50%)",          //  Crescent
  "ellipse(50% 50% at 50% 50%)",          //  Half moon
  "ellipse(75% 50% at 50% 50%)",          //  Gibbous
  "circle(50% at 50% 50%)"                // back to Full moon
];

let index = 0;
setInterval(() => {
  index = (index + 1) % phases.length;
  anime({
    targets: '.main__puzzle',
    clipPath: phases[index],
    duration: 2000,
    easing: 'easeInOutQuad'
  });
}, 4000);