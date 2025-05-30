document.querySelectorAll("[timeline-heading]").forEach((heading) => {
  gsap.to(heading, {
    color: "#76b3f4",
    duration: 0.6,
    scrollTrigger: {
      trigger: heading,
      start: "top center",
      end: "bottom center",
      toggleActions: "play none none reverse",
      scrub: true,
      //   markers: true,
    },
  });
});

document.querySelectorAll(".court_block").forEach((court_block) => {
  court_block.addEventListener("mouseenter", () => {
    court_block.classList.add("active");
    document.querySelectorAll(".court_block").forEach((other_block) => {
      if (other_block !== court_block) {
        other_block.classList.remove("active");
      }
    });
  });
});

console.log("About page script loaded");
