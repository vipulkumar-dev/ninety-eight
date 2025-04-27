import { roll } from "../utils.js";
import { liveReload } from "../liveReload.js";

const header = document.getElementById("header");
let lastScrollPosition = 0;
let delta = 50; // Minimum scroll distance before toggling header
let ticking = false;
let isMenuOpen = false;

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

const menu_tl = gsap.timeline({
  paused: true,
  defaults: {
    duration: 0.3,
    ease: "power3.inOut",
  },
});

menu_tl

  .to(".menu_line.top", {
    y: 7,
    duration: 0.2,
  })
  .to(
    ".menu_line.bottom",
    {
      y: -7,
      duration: 0.2,
    },
    "<"
  )

  .to(".menu_line.top", {
    rotate: 45,
  })
  .to(
    ".menu_line.bottom",
    {
      rotate: -45,
    },
    "<"
  )
  .fromTo(
    ".navigation_wrapper",
    {
      y: "-100%",
    },
    {
      y: "0%",
      duration: 1.2,
    },
    "-=0.7"
  )
  .fromTo(
    ".nav_animate",
    {
      x: "150px",
    },
    {
      x: "0px",
      duration: 0.9,
      stagger: 0.03,
    },
    "-=1.1"
  );

isMenuOpen = false;
document.querySelector(".menu_trigger").addEventListener("click", () => {
  if (!isMenuOpen) {
    console.log("open");
    menu_tl.play();
  } else {
    console.log("close");
    menu_tl.reverse();
  }
  isMenuOpen = !isMenuOpen;
});

// console.log("From how it why");
roll("[roll]", 80);
liveReload();
