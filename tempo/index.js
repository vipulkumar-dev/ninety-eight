import { roll, getDevices } from "../utils.js";
import { liveReload } from "../liveReload.js";

const { isDesktop, isMobile } = getDevices();

const header = document.getElementById("header");
let isMenuOpen = false;
let lastScrollPosition = 0;
let delta = isDesktop ? 30 : 60; // Minimum scroll distance before toggling header
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
  if (!isMenuOpen) {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
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
    rotate: 225,
    width: "82%",
    duration: 0.5,
  })
  .to(
    ".menu_line.bottom",
    {
      rotate: -45,
      width: "82%",
    },
    "<"
  )
  .fromTo(
    ".navigation_wrapper",
    {
      x: "100%",
    },
    {
      x: "0%",
      duration: 0.8,
    },
    "-=0.7"
  )
  .fromTo(
    ".nav_animate",
    {
      x: "500px",
    },
    {
      x: "0%",
      stagger: 0.04,
      duration: 0.8,
    },
    "-=0.7"
  );

const menu_trigger = document.querySelector(".menu_trigger");

menu_trigger.addEventListener("click", () => {
  if (!isMenuOpen) {
    menu_tl.play();
  } else {
    menu_tl.reverse();
  }
  isMenuOpen = !isMenuOpen;
});

// var scriptLocation = document.currentScript.src;
// console.log("scriptLocation", scriptLocation);

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(handleScroll);
    ticking = true;
  }
});

document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("mouseenter", (e) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    target.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

//M8 0.5H257C261.142 0.5 264.5 3.85786 264.5 8V55C264.5 59.1421 261.142 62.5 257 62.5H27.2646C25.3029 62.5 23.4193 61.7309 22.0176 60.3584L12.3496 50.8926L2.75293 41.4961C1.31212 40.0853 0.5 38.1532 0.5 36.1367V8L0.509766 7.61426C0.710536 3.65139 3.98724 0.5 8 0.5Z

// console.log("From how it why");
roll("[roll]", 80);
liveReload();
