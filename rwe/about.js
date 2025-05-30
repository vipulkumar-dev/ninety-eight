document.querySelectorAll("[timeline-heading]").forEach((heading) => {
  gsap.to(heading, {
    color: "#76b3f4",
    duration: 0.6,
    scrollTrigger: {
      trigger: heading,
      start: "top center",
      end: "bottom center",
      toggleActions: "play none none reverse",
      //   markers: true,
    },
  });
});

console.log("About page script loaded");
