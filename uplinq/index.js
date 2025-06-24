import { roll, getDevices, lenisInit } from "../utils.js";
import { liveReload } from "../liveReload.js";

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

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

  const nav_items_tl = gsap.timeline({
    paused: true,
    defaults: {
      ease: "power4.inOut",
    },
  });

  menu_tl
    .to(".menu_line.top", { y: "6.5px" })
    .to(".menu_line.bottom", { y: "-6.5px" }, "<")
    .to(".menu_line.top", { rotate: 225, width: "82%", duration: 0.5 })
    .to(".menu_line.bottom", { rotate: -45, width: "82%" }, "<")
    .fromTo(
      ".navigation_wrapper",
      { y: "-100%" },
      { y: "0%", duration: 2 },
      "-=1.3"
    );

  nav_items_tl.fromTo(
    ".nav_animate .nav_item",
    {
      y: "150%",
      opacity: 0,
      scaleY: 2,
      transformOrigin: "top",
    },
    {
      y: "0%",
      opacity: 1,
      scaleY: 1,
      stagger: 0.07,
      delay: 0.4,
      duration: 1.3,
    }
  );

  const menu_trigger = document.querySelector(".menu_trigger");

  menu_trigger?.addEventListener("click", () => {
    if (!isMenuOpen) {
      menu_tl.play();
      // Only play nav_items_tl if it's not already playing or active
      if (!nav_items_tl.isActive()) {
        nav_items_tl.play(0);
      } // always play forward
    } else {
      menu_tl.reverse();
      // Don't reverse nav_items_tl (skip it)
    }
    isMenuOpen = !isMenuOpen;
  });
}

(function faq_init() {
  const faq_items = document.querySelectorAll(".faq_item");

  let skipCallback = true;

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

    if (index === 0) {
      faqItem.click(); // auto-open first item
    }
  });

  function faqTimeline(faqItem) {
    const faqTl = gsap
      .timeline({
        paused: true,
        defaults: {
          duration: 0.8,
          ease: "power4.inOut",
        },
        onComplete: () => {
          if (skipCallback) {
            skipCallback = false; // only skip first
            return;
          }
          console.log("FAQ animation complete");
          lenis.resize();
          ScrollTrigger.refresh();
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
          opacity: 1,
          filter: "blur(0px)",
        },
        0
      )
      .to(
        faqItem.querySelector(".faq_storke"),
        {
          opacity: 1,
        },
        0
      )
      .to(
        faqItem.querySelectorAll(".faq_arrow"),
        {
          rotate: 90,
        },
        0
      );

    return faqTl;
  }
})();

const faqSection = document.querySelector(".section_faq");

if (faqSection) {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          lenis.resize();
          ScrollTrigger.refresh();
          observer.unobserve(entry.target); // safer than faqSection
        }
      });
    },
    {
      root: null,
      threshold: 0.1,
    }
  );

  observer.observe(faqSection);
} else {
  console.warn(".section_faq not found in the DOM");
}

// var scriptLocation = document.currentScript.src;
// console.log("scriptLocation", scriptLocation);

document.querySelectorAll(".btn").forEach((btn) => {
  let btn_blur_wpr = btn.querySelector(".btn_blur_wpr");
  let btn_width = btn.clientWidth;
  let btn_blur_wpr_width = btn_blur_wpr.clientWidth;
  let boundingRect = btn.getBoundingClientRect();

  // Update dimensions on resize
  const updateMeasurements = () => {
    btn_width = btn.clientWidth;
    btn_blur_wpr_width = btn_blur_wpr.clientWidth;
    boundingRect = btn.getBoundingClientRect();
  };

  window.addEventListener("resize", updateMeasurements);

  btn.addEventListener("mousemove", (e) => {
    const x = e.clientX - boundingRect.left;
    const t = x / btn_width;
    const curve = 1 - 0.35 * Math.sin(Math.PI * t);
    const dynamic_width = btn_blur_wpr_width * curve;
    const mapped_x = gsap.utils.mapRange(
      0,
      btn_width,
      0,
      btn_width - dynamic_width,
      x
    );
    const mapped_opacity = gsap.utils.mapRange(0, btn_width, 0, 1, x);

    gsap.to(btn_blur_wpr, {
      x: mapped_x,
      width: dynamic_width,
      duration: 0.3,
    });

    gsap.to(btn_blur_wpr.querySelector(".blur_left"), {
      opacity: mapped_opacity,
      duration: 0.3,
    });

    gsap.to(btn_blur_wpr.querySelector(".blur_right"), {
      opacity: 1 - mapped_opacity,
      duration: 0.3,
    });
  });

  // Initial measurement
  updateMeasurements();
});

document.querySelectorAll(".btn_secondary").forEach((btn) => {
  const btn_tl = gsap.timeline({
    paused: true,
  });

  btn_tl.to(
    btn.querySelector(".btn_seconday_bg"),
    {
      height: "250%",
      rotate: 90,
      duration: 0.8,

      ease: "power3.inOut",
    },
    0
  );
  btn_tl.to(
    btn.querySelector(".btn_arrow"),
    {
      rotate: 45,
      duration: 0.8,

      ease: "power4.inOut",
    },
    0
  );

  btn.addEventListener("mouseenter", () => {
    btn_tl.play();
  });

  btn.addEventListener("mouseleave", () => {
    btn_tl.reverse();
  });
});

(function card_rotate() {
  gsap.from(".card_who.is-top", {
    rotateZ: 5,
    paused: true,
    duration: 1.5,
    scrollTrigger: {
      trigger: ".card_who.is-top",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      // markers: true,
    },
  });

  gsap.from(".card_who.is-back", {
    rotateZ: -5,
    paused: true,
    duration: 1.5,
    scrollTrigger: {
      trigger: ".card_who.is-back",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      // markers: true,
    },
  });
})();

(function popup_init() {
  const popupTriggers = document.querySelectorAll("[popup-trigger]");
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
      ".main-wrapper",
      {
        filter: "blur(12px)",
      },
      "<"
    );

  popupTriggers.forEach((popupTrigger) => {
    popupTrigger.addEventListener("click", () => {
      popup_animation.play();
    });
  });

  closeTriggers.forEach((closeTrigger) => {
    closeTrigger.addEventListener("click", () => {
      popup_animation.reverse();
    });
  });
})();

(function hero_screen() {
  gsap.to(".hero_screen_blur", {
    scaleX: 1.6,
    paused: true,
    duration: 1.5,
    scrollTrigger: {
      trigger: ".hero_screen_wpr",
      start: "top 70%",
      end: "top 40%",
      scrub: 1,
      // markers: true,
    },
  });

  gsap.to(".hero_screen_highlight", {
    scaleX: 1.28,
    paused: true,
    duration: 1.5,
    scrollTrigger: {
      trigger: ".hero_screen_wpr",
      start: "top 70%",
      end: "top 40%",
      scrub: 1,
      // markers: true,
    },
  });
})();

(function cta_logo() {
  gsap.to(".cta_logo_overlay", {
    height: "100%",
    duration: 1.5,
    scrollTrigger: {
      trigger: ".cta_logo",
      start: "center 80%",
      end: "center top",
      scrub: isDesktop ? 1 : false,
      // markers: true,
    },
  });
})();

(function hero_light_init() {
  const hero_light_tl = gsap.timeline({
    // paused: true,
    repeat: -1,
    yoyo: true,
    defaults: {
      ease: "none",
      duration: 3,
    },
  });

  hero_light_tl
    .fromTo(
      ".hero_light_2",
      { opacity: "0%" },
      {
        opacity: "15%",
      }
    )
    .fromTo(
      ".hero_light_1",
      { opacity: "100%" },
      {
        opacity: "80%",
      }
    ),
    "<";
})();

// document.querySelectorAll(".line").forEach((line) => {
//   gsap.fromTo(
//     line,
//     { bottom: "0%" },
//     {
//       bottom: "100%",
//       ease: "none",
//       repeat: -1,
//       duration: 6,
//       delay: (index, target) => {
//         const sepeficDelay = Number(target.getAttribute("delay"));
//         return sepeficDelay;
//       },
//     }
//   );
// });

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

document.querySelectorAll(".swiper").forEach((swiper) => {
  const swiperInstance = new Swiper(swiper, {
    direction: "horizontal",
    speed: 600,
    slidesPerView: 3,
    spaceBetween: 4,
    grabCursor: true,
    centeredSlides: true,
    // longSwipes: false,
    autoplay: {
      delay: 4000,
    },
    oneWayMovement: true,
    loop: true,
    navigation: {
      nextEl: document.querySelector(".swiper_next"),
      prevEl: document.querySelector(".swiper_prev"),
    },
  });
});

document.querySelectorAll("[pricing-button]")?.forEach((button, index) => {
  button.addEventListener("click", () => {
    addActiveNav(button);
  });
});

const textTwin = gsap.to("[tax-value]", {
  textContent: (index, target) => {
    console.log("target", target);
    if (target.hasAttribute("tax-value")) {
      return target.getAttribute("tax-value");
    }
    return 100;
  },
  paused: true,
  duration: 1,
  ease: "power4.inOut",
  snap: { textContent: 1 },
});

document.querySelector("[tax-button]")?.addEventListener("click", () => {
  textTwin.play();
});

document
  .querySelector("[bookkepeing-button]")
  ?.addEventListener("click", () => {
    textTwin.reverse();
  });

function addActiveNav(button) {
  // button.forEach((button) => {
  //   button.classList.remove("active");
  // });
  document.querySelectorAll("[pricing-button]").forEach((btn) => {
    btn.classList.remove("active");
  });
  button.classList.add("active");

  const pricing_btn_bg = document.querySelector(".pricing_btn_bg");
  const state = Flip.getState(pricing_btn_bg);

  button.appendChild(pricing_btn_bg);
  Flip.from(state, {
    absolute: true,
    duration: 0.4,
    zIndex: -1,
    ease: "power3.inOut",
  });
}

liveReload();
