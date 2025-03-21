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

const about_wpr = document.querySelector(".about_content");
const about_dash = document.querySelector(".about_dash");
const DASH_TRANSFORM = isMobile ? 184 : 144;

const about_dash_tw = gsap.to(about_dash, {
  top: () => {
    const topH = about_wpr.offsetHeight;
    const dashtopH = about_dash.offsetHeight;
    return `${topH + DASH_TRANSFORM - dashtopH}px`;
  },
  ease: "linear",
  scrollTrigger: {
    trigger: ".about_content",
    start: "top 30%",
    end: "bottom 60%",
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

ScrollTrigger.batch("[fade-animation]", {
  start: (element, triggers) => {
    if (element.trigger.hasAttribute("after-pinned")) {
      return `top+=${PIN_SPACING} 100%`;
    }
    return "top 100%";
  },

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
