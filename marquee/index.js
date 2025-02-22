(function Marquee() {
  const marquee = document.querySelectorAll("[marquee]");
  //   const marqueeContent = marquee.querySelector(".marquee-content");
  //   const marqueeItems = marqueeContent.querySelectorAll(".marquee-item");
  const isReverse = true;

  const marqueeAnims = [];

  marquee.forEach((marquee) => {
    const marquee_wrapper = marquee.children[0];
    const marquee_wrapper_clone = marquee_wrapper.cloneNode(true);
    marquee.appendChild(marquee_wrapper_clone);

    const marqueeAnim = gsap.to([marquee_wrapper, marquee_wrapper_clone], {
      xPercent: isReverse == false ? 100 : -100,
      duration: 10,
      repeat: -1,
      ease: "none",
    });

    marqueeAnims.push(marqueeAnim);
  });

  return marqueeAnims;
})();

function roll(
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
