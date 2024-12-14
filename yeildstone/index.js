import { getCurrentTime, roll } from "../utils.js";
import { liveReload } from "../liveReload.js";
gsap.registerPlugin(Flip, ScrollTrigger, ScrollToPlugin);

const header = document.getElementById("header");
let lastScrollPosition = 0;
let delta = 30; // Minimum scroll distance before toggling header
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

const menu_tl = gsap.timeline({
  paused: true,
  defaults: {
    duration: 0.3,
    ease: "power3.inOut",
  },
  onReverseComplete: () => {
    menu_tl_hover.reverse();
  },
});

menu_tl
  .to(".menu_line.top", {
    top: "50%",
  })
  .to(
    ".menu_line.bottom",
    {
      bottom: "50%",
    },
    "<"
  )
  .to(".menu_line.top", {
    rotate: 45,
    width: "85%",
  })
  .to(
    ".menu_line.bottom",
    {
      rotate: -45,
      width: "85%",
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
      duration: 0.8,
    },
    "-=0.7"
  );

let isMenuOpen = false;
const menu_trigger = document.querySelector(".menu_trigger");

menu_trigger.addEventListener("click", () => {
  if (!isMenuOpen) {
    menu_tl.play();
  } else {
    menu_tl.reverse();
  }
  isMenuOpen = !isMenuOpen;
});

const buttonDefaults = {
  duration: 0.4,
  ease: "power2.inOut",
};

document.querySelectorAll(".button").forEach((button) => {
  button.addEventListener("mouseenter", () => {
    gsap.to(button, {
      backgroundColor: "#27d690",
      color: "#060318",
      ...buttonDefaults,
    });
    gsap.to(button.querySelector(".btn_arrow"), {
      backgroundColor: "#060318",
      color: "#27d690",
      ...buttonDefaults,
    });
    gsap.to(button.querySelectorAll(".arrow_svg"), {
      x: 27,
      ...buttonDefaults,
      duration: 0.5,
      ease: "power3.inOut",
    });
  });
  button.addEventListener("mouseleave", () => {
    gsap.to(button, {
      backgroundColor: "#06031861",
      color: "#fff",
      ...buttonDefaults,
    });
    gsap.to(button.querySelector(".btn_arrow"), {
      backgroundColor: "#27d690",
      color: "#060318",
      ...buttonDefaults,
    });
    gsap.to(button.querySelectorAll(".arrow_svg"), {
      x: 0,
      ...buttonDefaults,
      duration: 0.5,
      ease: "power3.inOut",
    });
  });
});

document.querySelectorAll(".feature_block").forEach((feature) => {
  feature.addEventListener("mouseenter", () => {
    document.querySelectorAll(".feature_block.active").forEach((feature) => {
      feature.classList.remove("active");
    });
    feature.classList.add("active");

    const feature_stripe = document.querySelector(".feature_stripe");
    const feature_stripe_wrapper = feature.querySelector(
      ".feature_stripe_wrapper"
    );
    const state = Flip.getState(feature_stripe);

    feature_stripe_wrapper.appendChild(feature_stripe);
    Flip.from(state, {
      absolute: true,
      duration: 0.5,
      ease: "power3.inOut",
    });
  });
});

roll("[roll]", 100);
liveReload();
