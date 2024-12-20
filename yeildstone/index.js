import PhotoSwipeLightbox from "https://unpkg.com/photoswipe/dist/photoswipe-lightbox.esm.js";
import { lenisInit } from "../utils.js";

const isDesktop = window.innerWidth > 991;

const closeArrowSVGString = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.9999 1.00007L1 19M0.999924 1L18.9998 18.9999" stroke="white" stroke-width="2.1"/>
</svg>
`;

const zoomSVGString = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="11.3947" cy="11.3947" r="9.39474" stroke="white" stroke-width="1.8"/>
<path d="M18.5791 18.5791L23.0002 23.0002" stroke="white" stroke-width="1.8"/>
<path class="plus_svgpath transtion-base" d="M11.3501 7.53027C11.3501 9.92583 11.3501 14.8196 11.3501 15.2303" stroke="white" stroke-width="1.8"/>
<path  d="M7.50049 11.3799C9.89604 11.3799 14.7898 11.3799 15.2005 11.3799" stroke="white" stroke-width="1.8"/>
</svg>
`;

const lightbox = new PhotoSwipeLightbox({
  closeSVG: closeArrowSVGString,
  zoomSVG: zoomSVGString,
  gallery: "#modal-gallery",
  children: ".zoom_image",
  pswpModule: () => import("https://unpkg.com/photoswipe"),
});

lightbox.init();

if (!isDesktop) {
  lightbox.on("closingAnimationStart", () => {
    gsap.fromTo(
      ".pswp__img",
      {
        opacity: 1,
      },
      {
        opacity: 0,
        duration: 0.2,
        delay: 0.1,
      }
    );
  });
}

document.querySelector("#view-modal").onclick = () => {
  lightbox.loadAndOpen(0, {
    gallery: document.querySelector("#modal-gallery"),
  });
};

lenisInit();

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

document.querySelectorAll(".button").forEach((button) => {
  const buttonTl = gsap.timeline({
    paused: true,
    defaults: {
      duration: 0.4,
      ease: "power2.inOut",
    },
  });

  buttonTl
    .to(
      button,
      {
        backgroundColor: "#27d690",
        color: "#060318",
      },
      0
    )
    .to(
      button.querySelector(".btn_arrow"),
      {
        backgroundColor: "#060318",
        color: "#27d690",
      },
      0
    )
    .to(
      button.querySelectorAll(".arrow_svg"),
      {
        x: 27,
        duration: 0.5,
        ease: "power3.inOut",
      },
      0
    )
    .fromTo(
      button.querySelectorAll(".arrow_svg.is-left"),
      { scale: 0 },
      {
        scale: 1,
        duration: 0.5,
        ease: "power3.inOut",
      },
      0
    )
    .fromTo(
      button.querySelectorAll(".arrow_svg.is-right"),
      { scale: 1 },
      {
        scale: 0,
        duration: 0.5,
        ease: "power3.inOut",
      },
      0
    );

  button.addEventListener("mouseenter", () => {
    buttonTl.play();
  });
  button.addEventListener("mouseleave", () => {
    buttonTl.reverse();
  });
});

///// FEATURES /////

const feature_blocks = document.querySelectorAll(".feature_block");
let next_feature = 1;
let feature_interval = setInterval(() => {
  addActiveFeature(feature_blocks[next_feature]);
  next_feature++;
  if (next_feature >= feature_blocks.length) {
    next_feature = 0;
  }
}, 2500);

document.querySelectorAll(".feature_block").forEach((feature) => {
  feature.addEventListener("mouseenter", () => {
    // stop interval temporarily
    clearInterval(feature_interval);
    addActiveFeature(feature);
  });
  feature.addEventListener("mouseleave", () => {
    // get the index of the feature
    const index = Array.from(feature_blocks).indexOf(feature);
    next_feature = index + 1;
    if (next_feature >= feature_blocks.length) {
      next_feature = 0;
    }
    feature_interval = setInterval(() => {
      addActiveFeature(feature_blocks[next_feature]);
      next_feature++;
      if (next_feature >= feature_blocks.length) {
        next_feature = 0;
      }
    }, 2500);
  });
});

function addActiveFeature(feature) {
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
}

///// PHASE /////

const phase_cards = document.querySelectorAll(".card");
const phase_wrapper = document.querySelector(".phase_wrapper");
const phase_container = document.querySelector(".phase_container");
const total_cards = phase_cards.length;
let last_card;

// Cache DOM queries and calculations
const move_x = phase_wrapper.offsetWidth - phase_container.offsetWidth;

const phaseTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".phase_wrapper",
    start: isDesktop ? "center center" : "top 65%",
    end: isDesktop ? "+=1500" : "bottom 65%",
    pin: isDesktop ? ".section_container_phase" : false,
    scrub: 0.6,
    onUpdate: (() => {
      let timeout;
      return (self) => {
        const current_card = Math.floor(self.progress * (total_cards - 0.5));
        if (current_card !== last_card) {
          last_card = current_card;
          phase_wrapper.querySelectorAll(".card.active").forEach((card) => {
            card.classList?.remove("active");
          });
          phase_cards[current_card]?.classList?.add("active");
        }
      };
    })(),
  },
});

phaseTl.to(phase_wrapper, {
  x: `-${move_x}px`,
  ease: "power2.inOut",
});

const nomics_tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".section_tokonomics",
    start: "center center",
    end: "bottom center",
    // markers: true,
    // pin: true,
    // scrub: true,
    onEnter: () => {
      phaseTl.scrollTrigger.refresh();
    },
    onLeave: () => {
      phaseTl.scrollTrigger.refresh();
    },
  },
});

// roll("[roll]", 100);
// liveReload();
