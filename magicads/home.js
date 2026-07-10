(function dashboardCardsReveal() {
  const cards = gsap.utils.toArray(".dashboard-card");
  if (!cards.length) return;

  gsap.registerPlugin(ScrollTrigger);

  // Trigger off the wrapper if it exists, otherwise the first card's section.
  const wrapper =
    document.querySelector(".dashboard-card-wpr") ||
    cards[0].closest("section") ||
    cards[0].parentElement;

  // Hardcoded START offset per card. x/y on inner (curved path), rotation/blur on outer.
  const POSITIONS = [
    { x: -220, y: -520, rot: -8, blur: 0 }, // far top-left
    { x: -300, y: -300, rot: -7, blur: 0 }, // left
    { x: -260, y: -140, rot: -6, blur: 0 }, // lower-left
    { x: -80, y: -620, rot: 4, blur: 6 }, // top center-left (blurred)
    { x: -120, y: -640, rot: -10, blur: 0 }, // top center-right (blurred)
    { x: 300, y: -560, rot: 8, blur: 6 }, // top-right (blurred)
    { x: 300, y: -320, rot: 9, blur: 0 }, // right
    { x: 340, y: -120, rot: 12, blur: 0 }, // lower-right
    { x: -180, y: -80, rot: -5, blur: 0 }, // bottom-left
  ];

  const fallback = (i) => ({
    x: (i % 2 === 0 ? -1 : 1) * (120 + (i % 3) * 90),
    y: -480 - (i % 4) * 60,
    rot: (i % 2 === 0 ? -1 : 1) * (6 + (i % 3) * 2),
    blur: 0,
  });

  const build = () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: "top 90%",
        end: "bottom 90%",
        scrub: 1,
        invalidateOnRefresh: true,
        // markers: true,
      },
    });

    cards.forEach((card, i) => {
      const inner = card.querySelector(".dashboard-card-inner") || card;
      const p = POSITIONS[i] || fallback(i);
      const at = i * 0.05; // small stagger so cards cascade in

      // x + y on inner at the same time — gentle opposing eases keep a soft
      // curve without the "slide left, then drop" feel.
      tl.fromTo(
        inner,
        { x: p.x },
        { x: 0, ease: "power3.inOut", duration: 1 },
        at,
      )
        .fromTo(
          inner,
          { y: p.y },
          { y: 0, ease: "power2.inOut", duration: 1 },
          at,
        )
        .fromTo(
          card,
          {
            rotation: p.rot,
            scale: 0.85,
            filter: `blur(${p.blur}px)`,
            transformOrigin: "50% 50%",
          },
          {
            rotation: 0,
            scale: 1,
            filter: "blur(0px)",
            ease: "power2.out",
            duration: 1,
          },
          at,
        );
    });

    return tl;
  };

  let tl = build();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      tl && tl.scrollTrigger && tl.scrollTrigger.kill();
      tl && tl.kill();
      gsap.set(cards, { clearProps: "all" });
      cards.forEach((c) => {
        const inner = c.querySelector(".dashboard-card-inner");
        if (inner) gsap.set(inner, { clearProps: "all" });
      });
      tl = build();
      ScrollTrigger.refresh();
    }, 250);
  });
})();

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
