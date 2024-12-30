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
    $("html, body").animate({ scrollTop: 0 }, 500);
  };
}

export function lenisInit() {
  // Initialize a new Lenis instance for smooth scrolling
  const lenis = new Lenis();

  // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
  lenis.on("scroll", ScrollTrigger.update);

  // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
  // This ensures Lenis's smooth scroll animation updates on each GSAP tick
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000); // Convert time from seconds to milliseconds
  });

  // Disable lag smoothing in GSAP to prevent any delay in scroll animations
  gsap.ticker.lagSmoothing(0);
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
