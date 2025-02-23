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

console.log("deepnode");

const nav_items = document.querySelectorAll(".nav_item");
let active_nav = 0;

nav_items.forEach((nav, index) => {
  nav.addEventListener("mouseenter", () => {
    addActiveNav(nav);
  });
  nav.addEventListener("mouseleave", () => {
    addActiveNav(nav_items[active_nav]);
  });

  nav.addEventListener("click", () => {
    active_nav = index;
    addActiveNav(nav);
  });
});

function addActiveNav(nav) {
  nav_items.forEach((nav) => {
    nav.classList.remove("active");
  });
  nav.classList.add("active");

  const nav_bg = document.querySelector(".nav_bg");
  const state = Flip.getState(nav_bg);

  nav.appendChild(nav_bg);
  Flip.from(state, {
    absolute: true,
    duration: 0.3,
    zIndex: -1,
    ease: "power2.inOut",
  });
}

// FAQ

const faq_items = document.querySelectorAll(".faq_item");

faq_items.forEach((faqItem, index) => {
  faqItem.isActive = false;
  const faqTl = faqTimeline(faqItem);
  faqItem.addEventListener("click", () => {
    if (!faqItem.isActive) {
      faqTl.play();
      faqItem.isActive = true;
    } else {
      faqTl.reverse();
      faqItem.isActive = false;
    }
  });

  if (index == 0) {
    faqItem.click();
  }
});

function faqTimeline(faqItem) {
  const faqTl = gsap
    .timeline({
      paused: true,
      defaults: {
        duration: 0.3,
        ease: "power2.inOut",
      },
    })
    .to(faqItem, {
      backgroundColor: "rgba(17, 209, 252, 0.1)",
      color: "white",
      paddingLeft: "35px",
      borderColor: "#11d1fc",
    })
    .to(
      faqItem.querySelector(".faq_content"),
      {
        gap: "26px",
      },
      0
    )
    .to(
      faqItem.querySelector(".faq_para"),
      {
        height: "auto",
        opacity: 1,
      },
      0
    )
    .to(
      faqItem.querySelector(".faq_arrow"),
      {
        rotate: 45,
      },
      0
    );

  return faqTl;
}

// console.log("From how it why");
// roll("[roll]", 80);
liveReload();
