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

if (isDesktop) {
  lenisInit();
}
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

///// HERO ANIMATION /////

if (isDesktop) {
  const hero_section = document.querySelector(".section_hero");
  const hero_width = hero_section.offsetWidth;
  const hero_strape = hero_section.querySelectorAll(".hero_strape");

  hero_section.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    const mapped_x = gsap.utils.mapRange(0, hero_width, -50, 30, x);
    const mapped_mask = gsap.utils.mapRange(0, hero_width, -116, -36, x);
    gsap.to(hero_strape, {
      x: mapped_x,
      duration: 0.3,
    });

    gsap.to(".hero_building.is-top", {
      maskPosition: `${mapped_mask}px center`,
      duration: 0.3,
    });
  });
}
///// FEATURES /////

document.querySelectorAll(".feature_container").forEach((feature_container) => {
  const feature_blocks = feature_container.querySelectorAll(".feature_block");
  let next_feature = 1;

  function feature_interval_create() {
    let feature_interval = setInterval(() => {
      addActiveFeature(feature_blocks[next_feature]);
      next_feature++;
      if (next_feature >= feature_blocks.length) {
        next_feature = 0;
      }
    }, 2500);

    return feature_interval;
  }

  let feature_interval = feature_interval_create();

  feature_blocks.forEach((feature) => {
    feature.addEventListener("mouseenter", () => {
      addActiveFeature(feature);
      const index = Array.from(feature_blocks).indexOf(feature);
      next_feature = index + 1;
      if (next_feature >= feature_blocks.length) {
        next_feature = 0;
      }
      clearInterval(feature_interval);
      feature_interval = feature_interval_create();
    });
  });

  function addActiveFeature(feature) {
    feature_container
      .querySelectorAll(".feature_block.active")
      .forEach((feature) => {
        feature.classList.remove("active");
      });
    feature.classList.add("active");

    const feature_stripe = feature_container.querySelector(".feature_stripe");
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
});

///// PHASE /////

const phase_cards = document.querySelectorAll(".card");
const phase_wrapper = document.querySelector(".phase_wrapper");
const phase_container = document.querySelector(".phase_container");
const PIN_SPACING = isDesktop ? 1500 : 0;

// Cache DOM queries and calculations
const move_x = phase_wrapper.offsetWidth - phase_container.offsetWidth;

const phaseTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".phase_wrapper",
    start: isDesktop ? "center 65%" : "top 65%",
    end: isDesktop ? `+=${PIN_SPACING}` : "bottom 65%",
    pin: isDesktop ? ".section_container_phase" : false,
    scrub: true,
    anticipatePin: 1,
    // onUpdate: () => {
    //   const current_card = Math.floor(self.progress * (total_cards - 0.5));
    //   if (current_card !== last_card) {
    //     last_card = current_card;
    //     phase_wrapper.querySelectorAll(".card.active").forEach((card) => {
    //       card.classList?.remove("active");
    //     });
    //     phase_cards[current_card]?.classList?.add("active");
    //   }
    // },
  },
  defaults: {
    duration: 1,
  },
});

phase_cards.forEach((card, index) => {
  if (index !== 0) {
    addActiveCard(card);
  }
});

function addActiveCard(card) {
  phaseTl.to(card, {
    color: "#27d690",
  });

  phaseTl.to(
    card.querySelector(".card_image"),
    {
      filter: "grayscale(0)",
    },
    "<"
  );
  phaseTl.to(
    card.querySelectorAll(".card_border"),
    {
      opacity: 0.6,
    },
    "<"
  );
  phaseTl.to(
    card.querySelectorAll(".card_gradient.is-green"),
    {
      opacity: 0.12,
    },
    "<"
  );

  phaseTl.to(
    card.querySelectorAll(".card_gradient.is-white"),
    {
      opacity: 0,
    },
    "<"
  );
}

if (isDesktop) {
  phaseTl.to(
    phase_wrapper,
    {
      x: `-${move_x}px`,
      ease: "power2.inOut",
      duration: phase_cards.length - 1.5,
    },
    0
  );
} else {
  phaseTl.to(
    phase_wrapper,
    {
      duration: phase_cards.length - 1.5,
    },
    0
  );
}

const nomics_tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".section_team",
    start: "center center",
    end: "bottom center",
    // markers: true,
    // pin: true,
    // scrub: true,
    onEnter: () => {
      ScrollTrigger.refresh();
    },
    onLeave: () => {
      ScrollTrigger.refresh();
    },
  },
});

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
      stagger: 0.04,
      duration: 0.8,
      ease: "power3.inOut",
    });
  },
});

const lottieData = [
  {
    name: "hero_lottie_1",
    link: "https://cdn.prod.website-files.com/675b2366b8047c66057f0ae8/676eea196883f1e67f67fcf1_YieldStone%20-%20motion%201.json",
    start: "top bottom",
    isMobile: true,
  },
  {
    name: "lottie_2",
    link: "https://cdn.prod.website-files.com/675b2366b8047c66057f0ae8/676f8988fe632e96fee59eba_YieldStone%20-%20motion%202.json",
    start: "center bottom",
    isMobile: true,
  },
  {
    name: "lottie_3",
    link: "https://cdn.prod.website-files.com/675b2366b8047c66057f0ae8/6771677fde847249fa8d583b_YieldStone%20-%20motion%203.json",
    start: "center bottom",
    isMobile: true,
  },
  {
    name: "lottie_4",
    link: "https://cdn.prod.website-files.com/675b2366b8047c66057f0ae8/677167aeb76ee24f1124f31e_YieldStone%20-%20motion%204.json",
    start: "center bottom",
    isMobile: true,
  },
  {
    name: "modal_lottie_1",
    link: "https://cdn.prod.website-files.com/675b2366b8047c66057f0ae8/676f8a3e66ec3b839a9b4acf_YieldStone%20-%20motion%205.json",
    start: "center bottom",
    isMobile: false,
  },
  {
    name: "modal_lottie_2",
    link: "https://cdn.prod.website-files.com/675b2366b8047c66057f0ae8/676f8a3e66ec3b839a9b4acf_YieldStone%20-%20motion%205.json",
    start: "center bottom",
    isMobile: false,
  },
  {
    name: "lottie_6",
    link: "https://cdn.prod.website-files.com/675b2366b8047c66057f0ae8/677167c90801d6e0aae00070_YieldStone%20-%20motion%206.json",
    start: `center+=${PIN_SPACING} bottom`,
    isMobile: false,
  },
  {
    name: "lottie_7",
    link: "https://cdn.prod.website-files.com/675b2366b8047c66057f0ae8/676f8a6af9dc9e24913aa565_YieldStone%20-%20motion%207.json",
    start: "top bottom",
    isMobile: true,
  },
];

lottieData.forEach((data) => {
  const lottie_container = document.querySelector(
    `[lottie-container=${data.name}]`
  );
  if (data.isMobile || isDesktop) {
    const lotteAnim = lottie.loadAnimation({
      container: lottie_container, // the dom element that will contain the animation
      renderer: "svg",
      name: data.name,
      loop: false,
      autoplay: false,
      path: data.link, // the path to the animation json
    });

    ScrollTrigger.create({
      trigger: lottie_container.parentElement,
      start: data.start,
      end: "+=0",
      // markers: true,
      // once: true,
      onEnter: () => {
        // lotteAnim.setDirection(1);
        // lotteAnim.playSegments(1, data.endSegment, true);
        lotteAnim.play();
        // lotteAnim.goToAndStop(50, true);
      },
    });
  }

  // lotteAnim.play();
});

// roll("[roll]", 100);
// liveReload();
