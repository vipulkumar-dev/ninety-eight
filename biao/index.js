import { roll, getDevices, lenisInit } from "../utils.js";
import { liveReload } from "../liveReload.js";
gsap.registerPlugin(ScrollTrigger);

const header = document.getElementById("header");
let lastScrollPosition = 0;
let delta = 50; // Minimum scroll distance before toggling header
let ticking = false;
const { isDesktop, isMobile } = getDevices();

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

if (isDesktop) {
  lenisInit();
}

const about_dash = gsap.to(".about_dash", {
  top: "83.3%",
  ease: "linear",
  scrollTrigger: {
    trigger: ".about_content",
    start: "top 30%",
    end: "bottom 50%",
    scrub: 0.3,
    // markers: true,
  },
});

// var scriptLocation = document.currentScript.src;
// console.log("scriptLocation", scriptLocation);

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(handleScroll);
    ticking = true;
  }
});

// console.log("From how it why");
roll("[roll]", 80);
liveReload();
