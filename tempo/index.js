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
  const btn_tl = gsap.timeline({
    paused: true,
    defaults: {
      duration: 0.3,
      ease: "power3.inOut",
    },
  });

  btn_tl.to(btn.querySelector(".btn_bg_path"), {
    duration: 0.3,
    // scale: 1.2,
    // attr: {
    //   d: "M8 0.5H257C261.142 0.5 264.5 3.85786 264.5 8V55C264.5 59.1421 261.142 62.5 257 62.5H27.2646C25.1808 62.5 24.0353 62.4996 21.5693 62.1533L21.5352 62.1494H5.7041L1.27246 57.8105L2.90039 41.9043L2.9248 41.6641L2.75293 41.4961C1.31212 40.0853 0.5 38.1532 0.5 36.1367V8C0.5 3.85786 3.85786 0.5 8 0.5Z",
    //   delta: 0,
    // },
    morphSVG:
      "M8 0.5H257C261.142 0.5 264.5 3.85786 264.5 8V55C264.5 59.1421 261.142 62.5 257 62.5H8.16504C4.05427 62.4998 0.709905 59.1906 0.666016 55.0801L0.5 39.4951V8L0.509766 7.61426C0.710536 3.65139 3.98724 0.5 8 0.5Z",
    scale: 1,
    ease: "power3.inOut",
  });

  //   <svg width="265" height="63" viewBox="0 0 265 63" fill="none" xmlns="http://www.w3.org/2000/svg">
  // <path d="M8 0.5H257C261.142 0.5 264.5 3.85786 264.5 8V55C264.5 59.1421 261.142 62.5 257 62.5H8.16504C4.05427 62.4998 0.709905 59.1906 0.666016 55.0801L0.5 39.4951V8L0.509766 7.61426C0.710536 3.65139 3.98724 0.5 8 0.5Z" fill="black" stroke="#949494"/>
  // </svg>

  btn.addEventListener("mouseenter", (e) => {
    btn_tl.play();
  });

  btn.addEventListener("mouseleave", (e) => {
    btn_tl.reverse();
  });
});

//

document.querySelectorAll("[para-reveal]").forEach((text) => {
  new SplitText(text, { type: "lines" });
  new SplitText(text, { type: "lines", linesClass: "para_line" });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: text,
      start: "top bottom",
      end: "bottom top",
    },
  });
  tl.fromTo(
    text.querySelectorAll(".para_line > div"),
    {
      y: "140%",
    },
    {
      y: 0,

      stagger: 0.1,
      duration: 1.5,
      ease: "power4.inOut",
    }
  );
});

// console.log("From how it why");
roll("[roll]", 80);
liveReload();
