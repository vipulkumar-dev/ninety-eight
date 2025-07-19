import { roll, getDevices, lenisInit } from "../utils.js";
import { liveReload } from "../liveReload.js";

document.querySelectorAll(".swiper").forEach((swiper) => {
  const swiperInstance = new Swiper(swiper, {
    direction: "horizontal",
    slidesPerView: "auto",
    spaceBetween: 16,
    speed: 500,
    // centeredSlides: true,
    // centeredSlidesBounds: true,

    loop: true,
    navigation: {
      nextEl: document.querySelector(".swiper_next"),
      prevEl: document.querySelector(".swiper_prev"),
    },
  });
});

const wprElements = document.querySelectorAll("[active-pagination-dot-number]");

wprElements.forEach((wpr) => {
  const activeDot = parseInt(
    wpr.getAttribute("active-pagination-dot-number"),
    10
  );
  const dots = wpr.querySelectorAll(".pagination_dots");

  // Remove 'active' from all dots
  dots.forEach((dot) => dot.classList.remove("is-active"));

  // Add 'active' to the correct dot (1-based to 0-based index)
  if (dots[activeDot - 1]) {
    dots[activeDot - 1].classList.add("is-active");
  }
});

const lenis = lenisInit();
const { isDesktop, isMobile } = getDevices();

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
let isMenuOpen = false;

window.addEventListener("scroll", () => {
  if (!isMenuOpen) {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }

  if (window.scrollY > 50) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
});

console.log("deepnode");

/// Menu

const menu_tl = gsap.timeline({
  paused: true,
  defaults: {
    duration: 0.3,
    ease: "power3.inOut",
  },
});

menu_tl
  .to(".menu_line", {
    width: "100%",
    duration: 0.3,
  })
  .to(".menu_line.top", {
    y: 5.2,
    duration: 0.2,
  })
  .to(
    ".menu_line.bottom",
    {
      y: -5.2,
      duration: 0.2,
    },
    "<"
  )
  .set(".menu_line.middle", { opacity: 0 })
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
    ".navigation_bg",
    {
      opacity: "0%",
    },
    {
      opacity: "100%",
      duration: 1.2,
    },
    "<"
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

// Nav

const nav_items = document.querySelectorAll(".nav_item");
const sections = [];

let active_nav = 0;

// Prepare sections list from nav hrefs
nav_items.forEach((nav) => {
  const id = nav.getAttribute("href");
  const section = document.querySelector(id);
  if (section) sections.push({ id, section });
});

// Mouse + click interactions
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
  nav_items.forEach((nav) => nav.classList.remove("active"));
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

// Scroll-based nav update
window.addEventListener("scroll", () => {
  const middleY = window.innerHeight / 2;

  for (let i = 0; i < sections.length; i++) {
    const { section } = sections[i];
    const rect = section.getBoundingClientRect();
    if (rect.top <= middleY && rect.bottom >= middleY) {
      if (active_nav !== i) {
        active_nav = i;
        addActiveNav(nav_items[i]);
      }
      break;
    }
  }
});

document.querySelectorAll(".btn").forEach((btn) => {
  let split = new SplitText(btn, {
    type: "words",
    wordsClass: "btn_char",
    deepslice: true,
    mask: "words",
  });

  split.words.forEach((word) => {
    setwordAnimation(word);
  });

  gsap.set(".btn_char-mask", {
    overflow: "visible",
  });

  btn.addEventListener("mouseenter", () => {
    gsap.to(btn.querySelectorAll(".btn_char-mask"), {
      y: "-100%",
      stagger: 0.07,
      duration: 1,
      ease: "power4.inOut",
    });
  });

  btn.addEventListener("mouseleave", () => {
    gsap.to(btn.querySelectorAll(".btn_char-mask"), {
      y: "0%",
      stagger: 0.07,
      duration: 1,
      ease: "power4.inOut",
    });
  });

  console.log("split", split.words);
});

function setwordAnimation(word) {
  // clone the word element
  const clone = word.cloneNode(true);
  word.parentNode.appendChild(clone);

  gsap.set(clone, {
    position: "absolute",
    top: "100%",
    left: 0,
    // y: "100%",
    // opacity: 0,
    // duration: 0.5,
    // ease: "power4.out",
  });
}

const faq_items = document.querySelectorAll(".faq_item");
let activeFaqItem = null;
let activeTimeline = null;

faq_items.forEach((faqItem, index) => {
  faqItem.isActive = false;
  const faqTl = faqTimeline(faqItem);

  faqItem.addEventListener("click", () => {
    // Close currently active item if it's not the same
    if (activeFaqItem && activeFaqItem !== faqItem) {
      activeTimeline.reverse();
      activeFaqItem.isActive = false;
    }

    if (!faqItem.isActive) {
      faqTl.play();
      faqItem.isActive = true;
      activeFaqItem = faqItem;
      activeTimeline = faqTl;
    } else {
      faqTl.reverse();
      faqItem.isActive = false;
      activeFaqItem = null;
      activeTimeline = null;
    }
  });

  if (index === 0) {
    faqItem.click();
  }
});

function faqTimeline(faqItem) {
  const faqTl = gsap
    .timeline({
      paused: true,
      defaults: {
        duration: 0.6,
        ease: "power4.inOut",
      },
      onComplete: () => {
        // lenis.resize();
        // ScrollTrigger.refresh();
      },
      onReverseComplete: () => {
        lenis.resize();
        ScrollTrigger.refresh();
      },
    })
    .to(
      faqItem.querySelector(".faq_content"),
      {
        height: "auto",
        filter: "blur(0px)",
      },
      0
    )
    .from(
      faqItem.querySelector(".faq_para"),
      {
        opacity: 0,
        filter: "blur(2px)",
      },
      0
    )
    .to(
      faqItem.querySelectorAll(".faq_header"),
      {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      },
      0
    )
    .to(
      faqItem.querySelectorAll(".faq_icon"),
      {
        rotate: 135,
      },
      0
    );

  return faqTl;
}

document.querySelectorAll("[para-reveal]").forEach((text) => {
  new SplitText(text, {
    type: "lines",
    deepslice: true,
    // mask: "lines",
    linesClass: "para_line",
  });
});

gsap.set("[para-reveal]", {
  opacity: 1,
});

ScrollTrigger.batch("[basic-reveal],[fade-reveal],[para-reveal]", {
  start: (scrollInstance) => {
    const eltrigger = scrollInstance.trigger;
    const eltriggerHeight = eltrigger.clientHeight * 1.4;
    // if (eltrigger.hasAttribute("basic-reveal")) {
    //   return `top-=${eltriggerHeight}px bottom`;
    // }
    return "top bottom";
  },
  end: (scrollInstance) => {
    const eltrigger = scrollInstance.trigger;
    const eltriggerHeight = eltrigger.clientHeight * 1.4;
    // if (eltrigger.hasAttribute("basic-reveal")) {
    //   return `top-=${eltriggerHeight}px bottom`;
    // }
    return "top bottom";
  },
  // markers: true,
  onEnter: (elements, triggers) => {
    const animateItems = [];
    let duration = 1;

    elements.forEach((element) => {
      if (element.hasAttribute("basic-reveal")) {
        animateItems.push(element);
      }
      if (element.hasAttribute("para-reveal")) {
        console.log("para", element);
        element.querySelectorAll(".para_line").forEach((line) => {
          animateItems.push(line);
        });
      }
      if (element.hasAttribute("fade-reveal")) {
        animateItems.push(element);
      }
    });
    // console.log("animateItems", animateItems);

    gsap.to(animateItems, {
      y: "0%",
      opacity: 1,
      filter: "blur(0px)",
      scaleY: 1,
      stagger: 0.04,
      duration: (index, target) => {
        if (target.hasAttribute("extra-time")) {
          return 2.5;
        }
        return 1.5;
      },
      ease: "power4.inOut",
    });
  },
});

liveReload();
