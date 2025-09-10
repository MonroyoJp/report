function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

class Slideshow {
  constructor(el) {
    this.DOM = {};
    this.DOM.el = el;
    this.settings = {
      animation: {
        slides: {
          duration: 500,
          easing: 'easeOutQuint'
        },
        shape: {
          duration: 300,
          easing: { in: 'easeOutQuint', out: 'easeOutQuad' }
        }
      },
      frameFill: 'url(#gradient1)'
    };
    this.init();
  }

  init() {
    this.DOM.slides = Array.from(this.DOM.el.querySelectorAll('.slides--images > .slide'));
    this.slidesTotal = this.DOM.slides.length;
    this.DOM.nav = this.DOM.el.querySelector('.slidenav');
    this.DOM.titles = this.DOM.el.querySelector('.slides--titles');
    this.DOM.titlesSlides = Array.from(this.DOM.titles.querySelectorAll('.slide'));
    this.DOM.nextCtrl = this.DOM.nav.querySelector('.slidenav__item--next');
    this.DOM.prevCtrl = this.DOM.nav.querySelector('.slidenav__item--prev');
    this.current = 0;
    this.createFrame();
    this.initEvents();
  }

  createFrame() {
    this.rect = this.DOM.el.getBoundingClientRect();
    this.paths = {
      initial: this.calculatePath('initial'),
      final: this.calculatePath('final')
    };
    this.DOM.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.DOM.svg.setAttribute('class', 'shape');
    this.DOM.svg.setAttribute('width', '100%');
    this.DOM.svg.setAttribute('height', '100%');
    this.DOM.svg.innerHTML = `
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#09012d"/>
          <stop offset="100%" stop-color="#0f2b73"/>
        </linearGradient>
      </defs>
      <path fill="${this.settings.frameFill}" d="${this.paths.initial}"/>`;
    this.DOM.el.insertBefore(this.DOM.svg, this.DOM.titles);
    this.DOM.shape = this.DOM.svg.querySelector('path');
  }

  calculatePath(path = 'initial') {
    if (path === 'initial') {
      return `M 0,0 0,${this.rect.height} ${this.rect.width},${this.rect.height} ${this.rect.width},0 0,0 Z 
              M 0,0 ${this.rect.width},0 ${this.rect.width},${this.rect.height} 0,${this.rect.height} Z`;
    } else {
      const point1 = { x: this.rect.width / 4 - 50, y: this.rect.height / 4 + 50 };
      const point2 = { x: this.rect.width / 4 + 50, y: this.rect.height / 4 - 50 };
      const point3 = { x: this.rect.width - point2.x, y: this.rect.height - point2.y };
      const point4 = { x: this.rect.width - point1.x, y: this.rect.height - point1.y };

      return `M 0,0 0,${this.rect.height} ${this.rect.width},${this.rect.height} ${this.rect.width},0 0,0 Z 
              M ${point1.x},${point1.y} ${point2.x},${point2.y} ${point4.x},${point4.y} ${point3.x},${point3.y} Z`;
    }
  }

  updateFrame() {
    this.paths.initial = this.calculatePath('initial');
    this.paths.final = this.calculatePath('final');
    this.DOM.shape.setAttribute('d', this.paths.initial);
  }

  initEvents() {
    this.DOM.nextCtrl.addEventListener('click', () => this.navigate('next'));
    this.DOM.prevCtrl.addEventListener('click', () => this.navigate('prev'));

    window.addEventListener('resize', debounce(() => {
      this.rect = this.DOM.el.getBoundingClientRect();
      this.updateFrame();
    }, 20));

    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowLeft') this.navigate('prev');
      else if (ev.key === 'ArrowRight') this.navigate('next');
    });
  }

  updateActiveLink(currentIndex) {
        const currentSlide = this.DOM.titlesSlides[currentIndex];
        const groupEl = currentSlide.querySelector("[data-group]");
        if (!groupEl) return;

        const group = groupEl.dataset.group;

        // reset all nav links
        document.querySelectorAll(".nav1 a").forEach(link =>
            link.classList.remove("active")
        );

        // activate matching one
        const activeLink = document.querySelector(`.nav1 a[data-group="${group}"]`);
        if (activeLink) activeLink.classList.add("active");
    }

  navigate(dir = 'next') {
  if (this.isAnimating) return;
  this.isAnimating = true;

  // shape closes in
  const animateShapeIn = anime({
    targets: this.DOM.shape,
    duration: this.settings.animation.shape.duration,
    easing: this.settings.animation.shape.easing.in,
    d: this.paths.final
  });

  const animateSlides = () => {
    return new Promise((resolve) => {
      // current slide out
      const currentSlide = this.DOM.slides[this.current];
      anime({
        targets: currentSlide,
        duration: this.settings.animation.slides.duration,
        easing: this.settings.animation.slides.easing,
        translateY: dir === 'next' ? this.rect.height : -this.rect.height,
        complete: () => {
          currentSlide.classList.remove('slide--current');
          resolve();
        }
      });

      // current title out
      const currentTitleSlide = this.DOM.titlesSlides[this.current];
      anime({
        targets: currentTitleSlide.children,
        duration: this.settings.animation.slides.duration,
        easing: this.settings.animation.slides.easing,
        delay: (t, i, total) => dir === 'next' ? i * 100 : (total - i - 1) * 100,
        translateY: [0, dir === 'next' ? 100 : -100],
        opacity: [1, 0],
        complete: () => currentTitleSlide.classList.remove('slide--current')
      });

      // update index
      this.current = dir === 'next'
        ? (this.current < this.slidesTotal - 1 ? this.current + 1 : 0)
        : (this.current > 0 ? this.current - 1 : this.slidesTotal - 1);

      // new slide in
      this.newSlide = this.DOM.slides[this.current];
      this.newSlide.classList.add('slide--current');
    

      // orb animation
      this.updateActiveLink(this.current);
      const shouldHideOrb = !this.newSlide.classList.contains('first-slide');
      anime({
        targets: window.orb,
        radius: shouldHideOrb ? [window.orb.radius, 0] : [0, window.orb.defaultRadius || 200],
        opacity: shouldHideOrb ? [1, 0] : [0, 1],
        duration: 1500,
        easing: "easeInOutQuad"
      });

      // slide motion
      anime({
        targets: this.newSlide,
        duration: this.settings.animation.slides.duration,
        easing: this.settings.animation.slides.easing,
        translateY: [dir === 'next' ? -this.rect.height : this.rect.height, 0]
      });

      // inner image animation
      const newSlideImg = this.newSlide.querySelector('.slide__img');
      anime.remove(newSlideImg);
      anime({
        targets: newSlideImg,
        duration: this.settings.animation.slides.duration * 3,
        easing: this.settings.animation.slides.easing,
        translateY: [dir === 'next' ? -100 : 100, 0],
        scale: [0.2, 1]
      });

      // new title in
      const newTitleSlide = this.DOM.titlesSlides[this.current];
      newTitleSlide.classList.add('slide--current');
      anime({
        targets: newTitleSlide.children,
        duration: this.settings.animation.slides.duration * 1.5,
        easing: this.settings.animation.slides.easing,
        delay: (t, i, total) => dir === 'next' ? i * 100 + 100 : (total - i - 1) * 100 + 100,
        translateY: [dir === 'next' ? -100 : 100, 0],
        opacity: [0, 1]
      });
    });
  };

  // shape opens back out
  const animateShapeOut = () => {
    anime({
      targets: this.DOM.shape,
      duration: this.settings.animation.shape.duration,
      easing: this.settings.animation.shape.easing.out,
      d: this.paths.initial,
      complete: () => { 
        this.isAnimating = false;
       
      },
    });
  };

  animateShapeIn.finished.then(animateSlides).then(animateShapeOut);
}
}

new Slideshow(document.querySelector('.slideshow'));

// since we use <div>, no need for imagesLoaded
document.body.classList.remove('loading');



