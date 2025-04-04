import { roll, getDevices, lenisInit } from "../utils.js";
import { liveReload } from "../liveReload.js";

const lenis = lenisInit();
const { isDesktop, isMobile } = getDevices();

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

const faq_items = document.querySelectorAll(".faq_item");

faq_items.forEach((faqItem, index) => {
  faqItem.isActive = false;
  const faqTl = faqTimeline(faqItem);
  faqItem.addEventListener("click", () => {
    console.log(faqItem);
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
        duration: 0.6,
        ease: "power3.inOut",
      },
      onComplete: () => {
        lenis.resize();
        ScrollTrigger.refresh();
      },
      onReverseComplete: () => {
        lenis.resize();
        ScrollTrigger.refresh();
      },
    })
    .to(faqItem, {
      gap: isMobile ? "20px" : "26px",
    })

    .to(
      faqItem.querySelector(".faq_para"),
      {
        height: "auto",
        opacity: 1,
      },
      0
    )
    .to(
      faqItem.querySelectorAll(".faq_arrow"),
      {
        rotate: 180,
      },
      0
    );

  return faqTl;
}

console.log("adivsory");
roll("[roll]", 80);
liveReload();
