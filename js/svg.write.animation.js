import { exportNewslide } from "./demo6.js";

// Flags
let isThirdSlideActive = false;

function prepareStrokes(group){
  const elements = group.querySelectorAll("path, circle, polygon");
  elements.forEach(el=>{
    let length;
    if(el.tagName==="path" || el.tagName==="circle"){
      length = el.getTotalLength();
    } else if(el.tagName==="polygon"){
      // Approximate polygon length
      const pts = el.points;
      length = 0;
      for(let i=0;i<pts.numberOfItems;i++){
        const p1 = pts.getItem(i);
        const p2 = pts.getItem((i+1)%pts.numberOfItems);
        length += Math.hypot(p2.x-p1.x, p2.y-p1.y);
      }
    }
    el.setAttribute("stroke-dasharray", length);
    el.setAttribute("stroke-dashoffset", length);
    el.setAttribute("fill","none");
  });
}

const topGroup = document.querySelector(".topGroup");
const bottomGroup = document.querySelector(".bottomGroup");

prepareStrokes(topGroup);
prepareStrokes(bottomGroup);

let color1 = getComputedStyle(document.documentElement).getPropertyValue("--accent1").trim();
let color2 = getComputedStyle(document.documentElement).getPropertyValue("--accent2").trim();
let current = color1;
let next = color2;

function runAnimation() {
  anime.timeline({
    loop: false,
    easing: "easeInOutSine",
    complete: () => {
      [current, next] = [next, current];
      runAnimation(); // keep looping
    }
  })
  .add({
    targets: topGroup.querySelectorAll("path, circle, polygon"),
    strokeDashoffset: [anime.setDashoffset, 0],
    stroke: next,
    duration: 2000,
    delay: anime.stagger(50)
  })
  .add({
    targets: bottomGroup.querySelectorAll("path, circle, polygon"),
    strokeDashoffset: [anime.setDashoffset, 0],
    stroke: next,
    duration: 2000,
    delay: anime.stagger(50)
  })
  .add({
    targets: topGroup.querySelectorAll("path, circle, polygon"),
    strokeDashoffset: [0, anime.setDashoffset],
    duration: 2000,
    delay: anime.stagger(30)
  }, "+=1000")
  .add({
    targets: bottomGroup.querySelectorAll("path, circle, polygon"),
    strokeDashoffset: [0, anime.setDashoffset],
    duration: 2000,
    delay: anime.stagger(30)
  });
}

// Extra erase (hide groups completely)
function eraseElements() {
  anime({
    targets: [
      topGroup.querySelectorAll("path, circle, polygon"),
      bottomGroup.querySelectorAll("path, circle, polygon")
    ],
    strokeDashoffset: [0, anime.setDashoffset],
    duration: 600,
    easing: "easeInOutSine",
    complete: () => {
      topGroup.style.opacity = "0";
      bottomGroup.style.opacity = "0";
      topGroup.style.zIndex = "-1";
      bottomGroup.style.zIndex = "-1";
      topGroup.style.pointerEvents = "none";
      bottomGroup.style.pointerEvents = "none";
    },
    delay: anime.stagger(30)
  });
}

// Reveal back (resume visible)
function revealElements() {
  topGroup.style.opacity = "1";
  bottomGroup.style.opacity = "1";
  topGroup.style.zIndex = "auto";
  bottomGroup.style.zIndex = "auto";
  topGroup.style.pointerEvents = "auto";
  bottomGroup.style.pointerEvents = "auto";

  anime({
    targets: [
      topGroup.querySelectorAll("path, circle, polygon"),
      bottomGroup.querySelectorAll("path, circle, polygon")
    ],
    strokeDashoffset: [anime.setDashoffset, 0],
    duration: 600,
    easing: "easeInOutSine"
  });
}

const navHome = document.querySelector("#nav__home");

// Animate nav__home out (translate right)
function hideNavHome() {
  anime({
    targets: navHome,
    translateX: "100%", // move fully to the right
    opacity: 0,
    duration: 500,
    easing: "easeInOutQuad"
  });
}

// Animate nav__home back (translate normal)
function showNavHome() {
  anime({
    targets: navHome,
    translateX: "0%", // back to original position
    opacity: 1,
    duration: 500,
    easing: "easeInOutQuad"
  });
}

// Watch for slide changes
export function checkSlideAndAnimate() {
  const slide = exportNewslide();

  if (slide === "third-slide" && !isThirdSlideActive) {
    isThirdSlideActive = true;
    eraseElements();
    hideNavHome();
  } else if (slide !== "third-slide" && isThirdSlideActive) {
    isThirdSlideActive = false;
    revealElements();
    showNavHome();
  }
}

// Start background animation
runAnimation();


