export const getCurrentTime = () => {
  return new Date().toISOString();
};

export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

export function scrollResotration() {
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
}

export function lenisInit(lerp = 0.1) {
  // Initialize a new Lenis instance for smooth scrolling
  const lenis = new Lenis({
    lerp,
  });

  // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
  lenis.on("scroll", ScrollTrigger.update);

  // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
  // This ensures Lenis's smooth scroll animation updates on each GSAP tick
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000); // Convert time from seconds to milliseconds
  });

  // Disable lag smoothing in GSAP to prevent any delay in scroll animations
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function getDevices() {
  return {
    isDesktop: window.innerWidth > 991,
    isMobile: window.innerWidth < 991,
  };
}

export function roll(
  targets,
  pixelPerSecond = 1000,
  isReverse = false,
  gsapVars = {}
) {
  gsapVars.ease || (gsapVars.ease = "none");
  const rollAnims = [];
  const elements = gsap.utils.toArray(targets);
  elements.forEach((el, i) => {
    const pxSeconds = el.offsetWidth / pixelPerSecond;

    // console.log(pxSeconds);
    const clone = el.cloneNode(true);
    el.parentNode?.appendChild(clone);
    const rollAnim = gsap.to([el, clone], {
      xPercent: (isReverse = false ? 100 : -100),
      duration: pxSeconds,
      repeat: -1,
      onReverseComplete() {
        this.totalTime(this.rawTime() + this.duration() * 10); // otherwise when the playhead gets back to the beginning, it'd stop. So push the playhead forward 10 iterations (it could be any number)
      },
      ...gsapVars,
    });
    rollAnims.push(rollAnim);
  });

  return rollAnims;
}

export function convertVhToFixedHeight() {
  // Select all sections with vh-based heights (adjust selector as needed)
  const sections = document.querySelectorAll("[data-vh-section]");

  sections.forEach((section) => {
    // Get computed height of the section
    const computedHeight = section.offsetHeight;

    // Set the fixed height in pixels
    section.style.height = `${computedHeight}px`;
    section.style.minHeight = "unset"; // To override any min-height
  });
}
