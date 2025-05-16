gsap.registerPlugin(DrawSVGPlugin);

const logoTimeline = gsap.timeline({
  defaults: {
    duration: 1.2,
    ease: "power4.inOut",
  },
});

logoTimeline
  .from("#line-top", {
    drawSVG: 0,
    duration: 0.8,
    delay: 1,
  })
  .from(
    "#line-bottom",
    {
      drawSVG: "100% 100%",
      duration: 0.8,
    },
    "<"
  )
  .from(
    "#circle-outline",
    {
      drawSVG: 0,
    },
    "-=0.5"
  )
  .from(
    "#logo",
    {
      rotate: 45,
    },
    "<"
  )
  .from(
    "#extra-line",
    {
      drawSVG: 0,
    },
    "<"
  );
