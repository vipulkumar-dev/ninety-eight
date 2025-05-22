import { roll, getDevices } from "../utils.js";
import { liveReload } from "../liveReload.js";

gsap.registerPlugin(SplitText);

const { isDesktop, isMobile } = getDevices();
const header = document.getElementById("header");
if (header) {
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
}

const paragraph = document.querySelector("#paragraph");
// split elements with the class "split" into words and lines
let split = SplitText.create(paragraph, {
  type: "lines",
  mask: "lines",
});

// now animate the lines in a staggered fashion

let isActiveReveal = false;

document.querySelector("#basic").addEventListener("click", () => {
  if (!isActiveReveal) {
    gsap.fromTo(
      split.lines,
      {
        y: "200%",
        transformOrigin: "top center",
        // opacity: 0,
        // scaleY: 2,
        // skewY: 4,
      },
      {
        y: "0%",
        transformOrigin: "top center",
        opacity: 1,
        scaleY: 1,
        skewY: 0,
        stagger: 0.04,
        ease: "power1.out",
        overwrite: true,
        duration: 0.6,
      }
    );

    isActiveReveal = true;
  } else {
    gsap.fromTo(
      split.lines,
      {
        y: "200%",
        transformOrigin: "top center",
        opacity: 0,
        scaleY: 2,
        skewY: 4,
        filter: "blur(3px)",
      },
      {
        y: "0%",
        transformOrigin: "top center",
        opacity: 1,
        scaleY: 1,
        skewY: 0,
        filter: "blur(0px)",
        stagger: 0.06,
        ease: "power4.out",
        overwrite: true,
        duration: 0.8,
      }
    );
  }
});

document.querySelector("#main").addEventListener("click", () => {});

// toggle active class on the button when clicked
document.querySelectorAll(".reveal_btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.add("active");
  });
});

console.log(paragraph);

// var scriptLocation = document.currentScript.src;
// console.log("scriptLocation", scriptLocation);

// console.log("From how it why");
roll("[roll]", 80);
liveReload();
