
const orb = document.getElementById("orbCanvas");
const orbEnd = document.getElementById("orbCanvasEnd");


anime({
  targets: orb,
  translateY: ["-10px", "10px"],
  rotate: ["-5deg", "5deg"],
  direction: "alternate",
  loop: true,
  easing: "easeInOutSine",
  duration: 6000
});

anime({
  targets: orbEnd,
  translateY: ["-10px", "10px"],
  rotate: ["-5deg", "5deg"],
  direction: "alternate",
  loop: true,
  easing: "easeInOutSine",
  duration: 6000
});
