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

const defaultsCourt = {
  duration: 0.6,
  ease: "power3.inOut",
};
document.querySelector("[court-off]")?.addEventListener("mouseenter", () => {
  gsap.to(".off_txt", {
    opacity: 1,
    ...defaultsCourt,
  });

  gsap.to(".on_txt", {
    opacity: 0,
    ...defaultsCourt,
  });
});

document.querySelector("[court-on]")?.addEventListener("mouseenter", () => {
  gsap.to(".off_txt", {
    opacity: 0,
    ...defaultsCourt,
  });

  gsap.to(".on_txt", {
    opacity: 1,
    ...defaultsCourt,
  });
});

console.log("About page script loaded");
