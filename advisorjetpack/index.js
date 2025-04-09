import {
  roll,
  getDevices,
  lenisInit,
  convertVhToFixedHeight,
} from "../utils.js";
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

  if (window.scrollY > 0) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
});

const pillar_wpr = document.querySelector(".pillar_content");
const pillar_dash = document.querySelector(".pillar_dash");
const DASH_TRANSFORM = isMobile ? 18 : 18;

const pillar_dash_tw = gsap.to(pillar_dash, {
  top: () => {
    const topH = pillar_wpr.offsetHeight;
    const dashtopH = pillar_dash.offsetHeight;
    return `${topH - DASH_TRANSFORM}px`;
  },
  ease: "linear",
  scrollTrigger: {
    trigger: ".pillar_content",
    start: "top 30%",
    end: "bottom 60%",
    scrub: 0.3,
    // markers: true,
  },
});

////

const aboutItems = document.querySelectorAll(".about_item");

const aboutItemWidth = aboutItems[aboutItems.length - 1].offsetWidth;

// Loop through each item and add the event listener
aboutItems.forEach((item) => {
  item.style.width = aboutItemWidth + "px";
  item.addEventListener("mouseenter", function () {
    // Remove the 'active' class from all 'about_item' elements
    aboutItems.forEach((item) => item.classList.remove("active"));

    // Add the 'active' class to the current element
    item.classList.add("active");
  });
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
        duration: 0.4,
        ease: "power2.inOut",
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

const items = document.querySelectorAll("[data-number]");

gsap.from(items, {
  textContent: 0,
  duration: 1,
  scrollTrigger: {
    trigger: items,
    start: "top 70%",
    end: "top 70%",
    // markers: true,
  },
  ease: Power1.easeIn,
  snap: { textContent: 1 },
  // stagger: 1,
  // onUpdate: textContent.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
});

const swiper = new Swiper(".swiper", {
  // freeMode: true,
  slidesPerView: 1,
  spaceBetween: 16,
  // grabCursor: true,
  breakpoints: {
    479: {
      slidesPerView: "auto",
      spaceBetween: 23,
    },
  },
  navigation: {
    nextEl: ".swiper-custom-button.is-next",
    prevEl: ".swiper-custom-button.is-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

convertVhToFixedHeight();

console.log("adivsory");
roll("[roll]", 60);
liveReload();
