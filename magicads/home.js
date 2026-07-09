(function dashboardCardsReveal() {
  const cards = gsap.utils.toArray(".dashboard-card");
  if (!cards.length) return;

  gsap.registerPlugin(ScrollTrigger);

  // Trigger off the wrapper if it exists, otherwise the first card's section.
  const wrapper =
    document.querySelector(".dashboard-card-wpr") ||
    cards[0].closest("section") ||
    cards[0].parentElement;

  // Hardcoded START offset per card. y/rotation/blur run on the outer card,
  // x runs on the inner element — different eases on the two make a curved path.
  const POSITIONS = [
    { x: -220, y: -520, rot: -8, blur: 0 }, // far top-left
    { x: -300, y: -300, rot: -7, blur: 0 }, // left
    { x: -260, y: -140, rot: -6, blur: 0 }, // lower-left
    { x: -80, y: -620, rot: 4, blur: 6 }, // top center-left (blurred)
    { x: 120, y: -640, rot: 6, blur: 6 }, // top center-right (blurred)
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
        end: "bottom 55%",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    cards.forEach((card, i) => {
      const inner = card.querySelector(".dashboard-card-inner") || card;
      const p = POSITIONS[i] || fallback(i);
      const at = i * 0.05; // small stagger so cards cascade in

      // Horizontal on the inner (fast settle) + vertical on the outer (ease in)
      // = curved, swooping entrance.
      tl.fromTo(
        inner,
        { x: p.x, ease: "power4.out", duration: 1 },
        { x: 0, ease: "power4.out", duration: 1 },
        at,
      ).fromTo(
        card,
        {
          y: p.y,
          rotation: p.rot,
          scale: 0.85,
          filter: `blur(${p.blur}px)`,
          transformOrigin: "50% 50%",
          ease: "power2.in",
          duration: 1,
        },
        {
          y: 0,
          rotation: 0,
          scale: 1,
          filter: "blur(0px)",
          transformOrigin: "50% 50%",
          ease: "power2.in",
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
