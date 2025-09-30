const button_green = document.querySelector(".green_btn");
    const button_white = document.querySelector(".white_btn");
    const button_white2 = document.querySelector(".white_btn2");
    let button;
    let rippleClass;

    function setUpBtn(btn, ripple){
        btn.addEventListener("click", function(e){
            button = btn;
            rippleClass = ripple;
            handleClick(e, btn, rippleClass);
        })
    }
    setUpBtn(button_green, "ripple");
    setUpBtn(button_white, "ripple2");
    setUpBtn(button_white2, "ripple2");

    // Color cycle (like your anime.js demo)
    const colors = ["#FF6138", "#FFBE53", "#2980B9", "#282741"];
    let colorIndex = 0;
    function nextColor() {
      colorIndex = (colorIndex + 1) % colors.length;
      return colors[colorIndex];
    }


    function handleClick(e, button, rippleClass) {
        const target = document.querySelector("#Task2");
  if (target && button == button_white) {
    target.scrollIntoView({ behavior: "smooth" });
  }
  const rect = button.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Ripple
  const ripple = document.createElement("span");
  ripple.classList.add(rippleClass);
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = x - size / 2 + "px";
  ripple.style.top = y - size / 2 + "px";
  button.appendChild(ripple);
  console.log(button.appendChild(ripple));
  ripple.addEventListener("animationend", () => ripple.remove());

  // Particles
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement("span");
    particle.classList.add("particle");
    particle.style.left = x + "px";
    particle.style.top = y + "px";
    particle.style.background = nextColor();

    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 50 + 20;
    const dx = Math.cos(angle) * distance + "px";
    const dy = Math.sin(angle) * distance + "px";
    particle.style.setProperty("--x", dx);
    particle.style.setProperty("--y", dy);

    button.appendChild(particle);
    particle.addEventListener("animationend", () => {
      particle.remove();
    });
  }
}


    


   function animateAnsTask1() { 
  const task1WrapperClass = document.querySelector('.task1Answer');
  const answerTabClass = document.querySelector('.answerTab');
  const task1AnswerPClass = document.querySelector('.task1AnswerP');

  // Store original HTML the first time (so we can restore it later)
  if (!task1AnswerPClass.hasAttribute("data-original")) {
    task1AnswerPClass.setAttribute("data-original", task1AnswerPClass.innerHTML);
  }

  if (task1WrapperClass.style.display === "none" || !task1WrapperClass.style.display){
    anime({
      targets: task1WrapperClass,
      easing: "easeInOutQuad",
      duration: 100,
      complete: ()=> {
        task1WrapperClass.style.display = 'flex';

        anime({
          targets: answerTabClass,
          opacity: [0, 1],
          translateY: [50, 0],
          width: ['0%', '60%'],
          easing: "easeInOutQuad",
          duration: 500,
          complete: ()=> {
            // reset innerHTML from original before animating
            task1AnswerPClass.innerHTML = task1AnswerPClass.getAttribute("data-original");
            task1AnswerPClass.style.opacity = 0;

            const textEls = document.querySelectorAll('.task1AnswerP p');
            textEls.forEach(el => {
              let originalNodes = Array.from(el.childNodes); 
              el.innerHTML = ""; // clear content

              originalNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                  node.textContent.split("").forEach(c => {
                    let span = document.createElement("span");
                    span.textContent = c;
                    span.style.opacity = 0; 
                    span.setAttribute("data-char", "true");
                    el.appendChild(span);
                  });
                } else {
                  el.appendChild(node.cloneNode(true)); // preserve <span> tags (colored words)
                }
              });
            });

            // fade in container first
            anime({
              targets: task1AnswerPClass,
              opacity: [0, 1],
              duration: 200,
              complete: ()=> {
                // animate the characters
                textEls.forEach(el => {
                  anime({
                    targets: el.querySelectorAll("span[data-char]"),
                    opacity: [0,1],
                    delay: anime.stagger(20),
                    easing: "easeInOutQuad"
                  });
                });
              }
            });
          }
        });
      }
    });
  } else {
    anime({
      targets: task1AnswerPClass,
      opacity: [1, 0],
      duration: 150,
      easing: "easeInOutQuad",
      complete: ()=> {
        anime({
          targets: answerTabClass,
          opacity: [1, 0],
          translateY: [0, -50],
          width: ['60%', '0%'],
          easing: "easeInOutQuad",
          duration: 200,
          complete: ()=> {
            task1WrapperClass.style.display = 'none';
            task1AnswerPClass.style.opacity = 0; 
          }
        });
      }
    });
  }
}

