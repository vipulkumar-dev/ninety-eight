import {
  roll,
  lenisInit,
  getDevices,
  convertVhToFixedHeight,
} from "../utils.js";
import { liveReload } from "../liveReload.js";

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
    y: 5,
    duration: 0.2,
  })
  .to(
    ".menu_line.bottom",
    {
      y: -5,
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
      paddingLeft: isMobile ? "16px" : "35px",
      borderColor: "#11d1fc",
    })
    .to(
      faqItem.querySelector(".faq_content"),
      {
        gap: isMobile ? "20px" : "26px",
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
      faqItem.querySelectorAll(".faq_arrow"),
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
      stagger: 0.07,
      duration: 0.8,
      delay: 0.3,
      ease: "power3.inOut",
    });
  },
});
if (isDesktop) {
  document.querySelectorAll("[c-fade-section]").forEach((fadeSection) => {
    ScrollTrigger.create({
      trigger: fadeSection,
      start: "center 75%",
      end: "bottom 50%+=100px",
      pinnedContainer: ".section_pin",
      // markers: true,
      onEnter: () => {
        gsap.to(fadeSection.querySelectorAll("[c-fade-animation]"), {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          // stagger: 0.07,
          stagger: {
            // wrap advanced options in an object
            each: 0.2,
          },
          duration: 0.8,
          // delay: 0.3,
          ease: "power3.inOut",
        });
      },
    });
  });
} else {
  ScrollTrigger.batch("[c-fade-animation]", {
    start: (element, triggers) => {
      if (element.trigger.hasAttribute("after-pinned")) {
        return `top+=${PIN_SPACING} 100%`;
      }
      return "top-=80px 100%";
    },
    end: "top top",
    // markers: true,
    onEnter: (elements, triggers) => {
      gsap.to(elements, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        // stagger: 0.07,
        stagger: {
          // wrap advanced options in an object
          each: 0.1,
        },
        duration: 0.8,
        delay: 0.3,
        ease: "power3.inOut",
      });
    },
  });
}

const riveInstances = [];

function createRiveInstance(config) {
  const { canvasId, artboard, stateMachine, triggerId } = config;
  const canvas = document.getElementById(canvasId);

  const riveInstance = new rive.Rive({
    src: "https://cdn.prod.website-files.com/67b83ab9b85547fd239c9364/67c2db621c1d4c036d722394_untitled.riv",
    canvas: canvas,
    autoplay: true,
    artboard: artboard,
    stateMachines: [stateMachine],
    onLoad: () => {
      riveInstance.resizeDrawingSurfaceToCanvas();
      setupScrollTrigger(riveInstance, stateMachine, triggerId);
    },
  });

  riveInstances.push(riveInstance);
}

function useStateMachineInput(
  riveInstance,
  stateMachineName,
  inputName,
  initialValue
) {
  const input = riveInstance
    .stateMachineInputs(stateMachineName)
    .find((input) => input.name === inputName);
  if (input) {
    input.value = initialValue;
  }
  return input;
}

function setupScrollTrigger(riveInstance, stateMachineName, triggerId) {
  const progressInput = useStateMachineInput(
    riveInstance,
    stateMachineName,
    "progress",
    0
  );
  gsap.registerPlugin(ScrollTrigger);

  if (isDesktop) {
    const animationTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: `#${triggerId}`,
        start: `top 70%`,
        end: "bottom center",
        // markers: true,
        pinnedContainer: ".section_pin",
        scrub: 3, // Adjust scrub value as needed
      },
    });

    animationTimeline.to(progressInput, {
      value: 100,
      onUpdate: () => {
        riveInstance.play();
      },
      onStart: () => {
        riveInstance.play();
      },
      onComplete: () => {
        riveInstance.pause();
      },
    });
  } else {
    progressInput.value = 100;
    riveInstance.play();
  }
}

function initializeAnimations(configs) {
  configs.forEach((config) => {
    createRiveInstance(config);
  });
}

const animationConfigs = [
  {
    canvasId: "coin-bg",
    artboard: "production",
    stateMachine: "State Machine 1",
    triggerId: "coin-bg",
  },
];

initializeAnimations(animationConfigs);
convertVhToFixedHeight();

// console.log("From how it why");
roll("[roll]", 80);
liveReload();
