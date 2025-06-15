const jordanEl = document.querySelector(".jordan.main");
jordanEl.offsetWidth; // Force reflow

gsap.to(jordanEl, {
  left: jordanEl.parentElement.offsetWidth - jordanEl.offsetWidth + "px",
  duration: 0.6,
  scrollTrigger: {
    trigger: ".section_title_slide",
    start: "top bottom",
    end: "bottom top",
    toggleActions: "play none none reverse",
    scrub: true,
    // markers: true,
  },
});

const hennesy = document.querySelector(".hennesy.main");
hennesy.offsetWidth; // Force reflow

gsap.to(hennesy, {
  right: hennesy.parentElement.offsetWidth - hennesy.offsetWidth + "px",
  duration: 0.6,
  scrollTrigger: {
    trigger: ".section_title_slide",
    start: "top bottom",
    end: "bottom top",
    toggleActions: "play none none reverse",
    scrub: true,
    // markers: true,
  },
});
