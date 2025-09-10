 function wrapCharacters(selector) {
    document.querySelectorAll(selector).forEach(el => {
      const text = el.innerText;
      el.innerHTML = "";
      text.split("").forEach((char, i) => {
        const span = document.createElement("span");
        span.className = "char" + (i + 1);
        // keep spaces visible
        span.innerHTML = char === " " ? "&nbsp;" : char;
        el.appendChild(span);
      });
    });
  }

  wrapCharacters(".glitch-text");

  function glitchEffect() {
    const chars = document.querySelectorAll(".glitch-text span");
    chars.forEach(char => {
      if (Math.random() > 0.8) { // ~20% chance to glitch
        const x = (Math.random() - 0.5) * 15;
        const y = (Math.random() - 0.5) * 15;
        const angle = (Math.random() - 0.5) * 45;
        const flickerClass = "flicker" + (1 + Math.floor(Math.random() * 3));

        char.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
        char.style.opacity = Math.random() > 0.5 ? 0.6 : 1;
        char.classList.add(flickerClass);

        setTimeout(() => {
          char.style.transform = "translate(0,0) rotate(0)";
          char.style.opacity = 1;
          char.classList.remove(flickerClass);
        }, 200 + Math.random() * 200);
      }
    });
  }

  // Run glitch effect randomly every 400ms
  setInterval(glitchEffect, 2000);