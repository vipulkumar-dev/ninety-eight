(function problemHeadingColorReveal() {
  const heading = document.querySelector("[problem-section-heading]");
  if (!heading) return;

  gsap.registerPlugin(ScrollTrigger);

  // const defaultColor = getComputedStyle(heading).color;

  const END_COLORS = {
    orange: "#E96D00",
    blue: "#2700BE",
    grey: "#000D43",
  };

  const words = gsap.utils
    .toArray(heading.querySelectorAll("[orange], [blue], [grey]"))
    .map((el) => {
      const color =
        (el.hasAttribute("orange") && END_COLORS.orange) ||
        (el.hasAttribute("blue") && END_COLORS.blue) ||
        (el.hasAttribute("grey") && END_COLORS.grey);

      return { el, color };
    })
    .filter((w) => w.color);

  if (!words.length) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: heading,
      start: "center 80%",
      end: "center 45%",
      scrub: 1,
      invalidateOnRefresh: true,
      // markers: true,
    },
  });

  words.forEach(({ el, color }, i) => {
    tl.to(el, { color, ease: "none", duration: 0.4 });
  });
})();
