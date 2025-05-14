import {
  roll,
  getDevices,
  lenisInit,
  convertVhToFixedHeight,
} from "../utils.js";
import { liveReload } from "../liveReload.js";

const { isDesktop, isMobile } = getDevices();
const lenis = lenisInit();
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

// convertVhToFixedHeight();

const parallax_contents = document.querySelectorAll(".parallax_content");

const parallaxWidth =
  parallax_contents[0].offsetWidth * parallax_contents.length;

gsap.set(".hero_paralax_item", {
  width: `${parallaxWidth}px`,
});

const heroParallaxItemWidth =
  document.querySelector(".hero_paralax_item").offsetWidth;
const windowWidth = window.innerWidth;

const paralax_amount = heroParallaxItemWidth - windowWidth;

const parallaxTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".section_pin",
    start: "top top",
    end: `+=${paralax_amount * 1.2}`,
    scrub: 1,
    pin: true,
    anticipatePin: isMobile ? 2 : 0,
    // markers: true,
  },
});

document.querySelectorAll(".hero_paralax_item").forEach((item, index) => {
  const parallaxDelay = Number(item.getAttribute("parallax-delay"));
  gsap.to(item, {
    x: `-${paralax_amount - parallaxDelay * 300}px`,
    scrollTrigger: {
      trigger: ".section_pin",
      start: "top top",
      end: `+=${paralax_amount * 1.2}`,
      scrub: 1 + parallaxDelay * 0.5,
      // pin: true,
      // markers: true,
    },
    ease: "power1.inOut",
  });
});

// var scriptLocation = document.currentScript.src;
// console.log("scriptLocation", scriptLocation);

const popupTrigger = document.querySelector("[popup-trigger]");
const closeTriggers = document.querySelectorAll("[popup-close]");

const popup_animation = gsap.timeline({
  paused: true,
  defaults: {
    duration: 1,
    ease: "power4.inOut",
  },
});

popup_animation
  .to("[pop-up]", {
    autoAlpha: 1,
  })
  .to(
    "[popup-content]",
    {
      x: "0%",
    },
    "<"
  );
popupTrigger.addEventListener("click", () => {
  popup_animation.play();
});

closeTriggers.forEach((closeTrigger) => {
  closeTrigger.addEventListener("click", () => {
    popup_animation.reverse();
  });
});

let hoverTimeout;
document.querySelectorAll(".about_bio").forEach((about_bion, index) => {
  about_bion.isactive = index !== 0 ? false : true;
  about_bion.addEventListener("mouseenter", () => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      // don't do anything if already active
      if (!about_bion.isactive) {
        document
          .querySelectorAll(".about_bio")
          .forEach((about_bion_inner, innerIndex) => {
            if (about_bion_inner.isactive) {
              about_bio_deactive(about_bion_inner, innerIndex);
            }
          });
        about_bio_active(about_bion, index);
      }
    }, 70);
  });
});

const about_bio_default = {
  duration: 0.8,
  ease: "power4.inOut",
};

function about_bio_active(about_bio, index) {
  gsap.to(about_bio, {
    height: "auto",
    ...about_bio_default,
  });
  gsap.to(about_bio.querySelector(".about_shadow"), {
    opacity: 0,
    ...about_bio_default,
  });
  gsap.to(`[about-image-${index}]`, {
    opacity: 1,
    ...about_bio_default,
  });
  about_bio.isactive = true;
}

function about_bio_deactive(about_bio, index) {
  gsap.to(about_bio, {
    height: isDesktop ? 60 : 36,
    ...about_bio_default,
  });
  gsap.to(about_bio.querySelector(".about_shadow"), {
    opacity: 1,
    ...about_bio_default,
  });
  gsap.to(`[about-image-${index}]`, {
    opacity: 0,
    ...about_bio_default,
  });

  about_bio.isactive = false;
}

liveReload();
