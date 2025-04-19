import { roll, lenisInit } from "../utils.js";
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

const lenis = lenisInit();

// var scriptLocation = document.currentScript.src;
// console.log("scriptLocation", scriptLocation);

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(handleScroll);
    ticking = true;
  }
});

(function loaderAnimatiion() {
  const loaderTl = gsap.timeline({
    defaults: {
      duration: 3,
      ease: "power4.inOut",
    },
  });

  loaderTl
    .to(".loader_center_line", {
      height: "0%",
      duration: 2,
    })
    .to(
      ".loader_line",
      {
        height: "0%",
        duration: 2,
      },
      "<"
    );

  const loader_circle = document.querySelector(".loader_circle");
  const length = loader_circle.getTotalLength();

  // Set the stroke dash values
  loader_circle.style.strokeDasharray = length;
  loader_circle.style.strokeDashoffset = 0;

  loaderTl
    .to(
      ".loader_svg",
      {
        opacity: "0",
        delay: 1,
        duration: 1.3,
        // duration: 5,
      },
      "<"
    )
    .to(
      ".loader_circle",
      {
        strokeDashoffset: length,
        duration: 1.3,
        // duration: 5,
      },
      "<-0.4"
    );

  loaderTl
    .to(
      ".loader_bg_left",
      {
        x: "-101%",
        duration: 2,
      },
      "=-0.4"
    )
    .to(
      ".loader_bg_right",
      {
        x: "101%",
        duration: 2,
      },
      "<"
    );

  const hero_svg_path = document.querySelectorAll(".hero_svg path");

  hero_svg_path.forEach((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  });
  loaderTl
    .to(
      hero_svg_path,
      {
        strokeDashoffset: 0,
        stagger: 0.1,
      },
      "=-1.5"
    )
    .to(
      hero_svg_path,
      {
        fill: "rgb(251, 240, 218)",
        duration: 2,
      },
      "<=+1.5"
    );

  loaderTl
    .from(
      ".header_border",
      {
        width: 0,
        duration: 1.5,
      },
      "<"
    )
    .from(
      "[nav-reveal]",
      {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 2,
      },
      "<+0.3"
    );

  new SplitText("#hero-paragraph", { type: "lines" });
  new SplitText("#hero-paragraph", { type: "lines", linesClass: "line" });

  loaderTl
    .from(
      "#hero-paragraph .line > div",
      {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 2,
      },
      "<"
    )
    .from(
      ".hero-svg-small",
      {
        opacity: 0,
        duration: 1.5,
      },
      "<"
    )
    .from("#scroll-text", { y: 30, opacity: 0, duration: 1.5 }, "<+1");
})();

const menu_open_tl = gsap.timeline({
  paused: true,
  defaults: {
    duration: 2,
    ease: "power4.inOut",
  },
});
menu_open_tl
  .to(".navigation_left", {
    x: "0%",
    duration: 1.5,
  })
  .to(
    ".navigation_right",
    {
      x: "0%",
      duration: 1.5,
    },
    "<"
  )
  .from(
    ".nav_border",
    {
      width: "0%",
      duration: 1.5,
      stagger: 0.05,
    },
    "<+0.5"
  )
  .from(
    "[nav_animate]",
    {
      y: 50,

      duration: 1.5,
      stagger: 0.05,
    },
    "<"
  )
  .from(
    "[nav_animate_fade]",
    {
      opacity: 0,
      duration: 1.5,
      stagger: 0.05,
    },
    "<+1.5"
  );

const menu_close_tl = gsap.timeline({
  paused: true,
  defaults: {
    duration: 2,
    ease: "power4.inOut",
  },
});
menu_close_tl
  .to(".navigation_left", {
    x: "-101%",
    duration: 1.5,
  })
  .to(
    ".navigation_right",
    {
      x: "101%",
      duration: 1.5,
    },
    "<"
  );

const menu_trigger = document.querySelector(".menu_trigger");
const menu_close = document.querySelector(".menu_close");

menu_trigger.addEventListener("click", () => {
  menu_open_tl.restart();
  isMenuOpen = true;
});

menu_close.addEventListener("click", () => {
  menu_close_tl.restart();
  isMenuOpen = false;
});

// console.log("From how it why");
roll("[roll]", 80);
liveReload();
