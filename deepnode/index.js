import { roll, lenisInit } from "../utils.js";
import { liveReload } from "../liveReload.js";
const lenis = lenisInit();

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

  if (window.scrollY > 50) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
});

console.log("deepnode");

// Nav

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
    duration: 0.6,
    zIndex: -1,
    ease: "power3.inOut",
  });
}

const PIN_SPACING = 1000;

const steps_container = document.querySelector(".steps_container");
const step_block = document.querySelectorAll(".step_block");

const stepTl = gsap.timeline({
  paused: true,
  scrollTrigger: {
    trigger: steps_container,
    start: "center center",
    end: `+=${PIN_SPACING}px`,
    // markers: true,
    scrub: 0.2,
    pin: ".section_pin",
  },
  defaults: {
    duration: 0.5,
    ease: "power1.inOut",
  },
});

stepTl
  .addLabel("step1")
  .to(step_block, {
    x: "-100%",
  })
  .to(
    ".step_number.step_1",
    {
      opacity: 0,
    },
    "<"
  )
  .to(
    ".step_number.step_2",
    {
      opacity: 1,
    },
    "<"
  )
  .to(step_block, { duration: 0.15 })
  .addLabel("step2")
  .to(step_block, { duration: 0.15 })
  .to(step_block, {
    x: "-200%",
  })
  .to(
    ".step_number.step_2",
    {
      opacity: 0,
    },
    "<"
  )
  .to(
    ".step_number.step_3",
    {
      opacity: 1,
    },
    "<"
  )
  .to(step_block, { duration: 0.15 })
  .addLabel("step3");

document.querySelectorAll("[data-scroll-label]").forEach((element) =>
  element.addEventListener("click", () => {
    const scrollLabel = element.getAttribute("data-scroll-label");
    gsap.to(window, {
      scrollTo: stepTl.scrollTrigger.labelToScroll(scrollLabel),
      duration: 1,
    });
  })
);

// Coin

// const video = document.querySelector("#coin-video");

// const handleMouseMove = (event) => {
//   const mousePositionX = event.clientX;
//   const mappedTime = gsap.utils.mapRange(
//     0,
//     window.innerWidth,
//     video.duration,
//     0,
//     mousePositionX
//   );

//   gsap.to(video, {
//     currentTime: mappedTime,
//     ease: "none",
//     duration: 0.3,
//   });
// };

// window.addEventListener("mousemove", handleMouseMove);

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
        filter: "blur(0px)",
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
      filter: "blur(0px)",
      stagger: 0.04,
      duration: 0.8,
      ease: "power3.inOut",
    });
  },
});

// console.log("From how it why");
roll("[roll]", 80);
liveReload();
