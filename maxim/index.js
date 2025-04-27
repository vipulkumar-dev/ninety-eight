import { roll } from "../utils.js";
import { liveReload } from "../liveReload.js";

const header = document.getElementById("header");
let lastScrollPosition = 0;
let delta = 50; // Minimum scroll distance before toggling header
let ticking = false;

function handleScroll() {
  const currentScrollPosition = window.scrollY;

  if (Math.abs(currentScrollPosition - lastScrollPosition) > delta) {
    if (currentScrollPosition > lastScrollPosition) {
      // Scrolling down
      header.classList.add("hidden");
    } else {
      // Scrolling up
      header.classList.remove("hidden");
    }
    lastScrollPosition = currentScrollPosition;
  }

  ticking = false;
}

// var scriptLocation = document.currentScript.src;
// console.log("scriptLocation", scriptLocation);

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(handleScroll);
    ticking = true;
  }
});

document.querySelectorAll(".swiper").forEach((swiper) => {
  const swiperInstance = new Swiper(swiper, {
    // Optional parameters
    direction: "horizontal",
    slidesPerView: "auto",
    spaceBetween: 16,
    // loop: true,
    breakpoints: {
      479: {
        slidesPerView: "auto",
        spaceBetween: 28,
      },
    },
  });
});

ScrollTrigger.batch("[fade-animation]", {
  start: "top bottom",
  end: "top top",
  // markers: true,
  onEnter: (elements, triggers) => {
    gsap.to(elements, {
      opacity: 1,
      y: 0,
      stagger: 0.06,
      duration: 0.8,
      ease: "power2.inOut",
    });
  },
});

// console.log("From how it why");
roll("[roll]", 80);
liveReload();
