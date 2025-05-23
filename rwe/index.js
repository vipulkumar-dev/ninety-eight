import { roll, getDevices, lenisInit } from "../utils.js";
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

document.querySelectorAll(".swiper").forEach((swiper) => {
  const swiperInstance = new Swiper(swiper, {
    direction: "horizontal",
    slidesPerView: "auto",
    spaceBetween: 16,
    centeredSlides: true,
    grabCursor: true,
    centeredSlidesBounds: true,
    loopFillGroupBlank: false,
    // autoplay: {
    //   delay: 3000,
    // },
    loop: true,
    navigation: {
      nextEl: swiper.parentNode.querySelector(".swiper_next"),
      prevEl: swiper.parentNode.querySelector(".swiper_prev"),
    },
  });
});

gsap.to(".brand_stripe_rev", {
  y: "-100%",
  repeat: -1,
  duration: 20,
  ease: "none",
});

gsap.to(".brand_stripe", {
  y: "100%",
  repeat: -1,
  duration: 20,
  ease: "none",
});

function wiggle(selector) {
  document.querySelectorAll(selector).forEach((el) => {
    // wiggleProp(el, "scale", 0.93, 1);
    // wiggleProp(el, "rotation", -5, 5);
    wiggleProp(el, "x", -1, 1);
    wiggleProp(el, "y", -3, 3);
  });
}

function wiggleProp(element, prop, min, max) {
  const duration = Math.random() * (0.6 - 0.3) + 1;

  const tweenValue = Math.random() * (max - min) + min;

  gsap.to(element, {
    [prop]: tweenValue,
    duration: duration,
    ease: "power1.inOut",
    onComplete: () => wiggleProp(element, prop, min, max),
  });
}

wiggle("[wiggle]");

document.querySelectorAll(".press_item").forEach((press_item) => {
  const split = new SplitText(press_item.querySelector(".press_item_txt"), {
    type: "lines",
    linesClass: "press_item_line",
    deepslice: true,
    mask: "lines",
  });
  press_item.addEventListener("mouseenter", () => {
    gsap.to(press_item.querySelector(".press_item_content"), {
      height: "auto",
      opacity: 1,
      duration: 0.5,
      ease: "power3.inOut",
    });

    gsap.fromTo(
      split.lines,
      { y: "150%" },
      {
        y: "0%",
        duration: 0.5,
        stagger: 0.04,
        delay: 0.1,
        ease: "power3.inOut",
      }
    );
  });

  press_item.addEventListener("mouseleave", () => {
    gsap.to(press_item.querySelector(".press_item_content"), {
      height: "0",
      opacity: 0,
      duration: 0.5,
      ease: "power3.inOut",
    });
  });
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

document.querySelectorAll("[hover-link]").forEach((link) => {
  let split = new SplitText(link.querySelector("p"), {
    type: "words",
    wordsClass: "link_char",
    deepslice: true,
    mask: "words",
  });

  split.words.forEach((word) => {
    setwordAnimation(word);
  });

  gsap.set(".link_char-mask", {
    overflow: "visible",
  });

  link.addEventListener("mouseenter", () => {
    gsap.to(link.querySelectorAll(".link_char-mask"), {
      y: "-100%",
      stagger: 0.07,
      duration: 1,
      ease: "power4.inOut",
    });
  });

  link.addEventListener("mouseleave", () => {
    gsap.to(link.querySelectorAll(".link_char-mask"), {
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

document.querySelectorAll("[para-reveal]").forEach((text) => {
  new SplitText(text, {
    type: "lines",
    deepslice: true,
    mask: "lines",
    linesClass: "para_line",
  });
});

gsap.set("[para-reveal]", {
  opacity: 1,
});

const horizontalTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".horizontal_section_wpr",
    start: "center center",
    end: "+=3500",
    scrub: 1,
    pin: ".section_pin",
    // markers: true,
  },
});
document.querySelectorAll(".horizontal_section").forEach((section, i) => {
  if (i !== 0) {
    horizontalTl.to(".horizontal_section", {
      xPercent: -100 * i,
      ease: "power1.inOut",
      delay: 0.05,
    });
  }
});

document.querySelectorAll("[parallax-image]").forEach((image) => {
  const parallaxAmount = image.getAttribute("parallax-image");
  gsap.fromTo(
    image,
    {
      y: Number(parallaxAmount),
    },
    {
      scrollTrigger: {
        trigger: image,
        start: "top bottom",
        end: "bottom top",
        pinnedContainer: ".section_pin",
        scrub: true,
        // markers: true,
      },
      y: -1 * Number(parallaxAmount),
      duration: 1,
      ease: "none",
    }
  );
});

ScrollTrigger.batch("[reveal]", {
  start: (scrollInstance) => {
    const eltrigger = scrollInstance.trigger;
    const eltriggerHeight = eltrigger.clientHeight * 1.4;
    if (eltrigger.hasAttribute("basic-reveal")) {
      return `top-=${eltriggerHeight}px bottom`;
    }
    return "top bottom";
  },
  end: (scrollInstance) => {
    const eltrigger = scrollInstance.trigger;
    const eltriggerHeight = eltrigger.clientHeight * 1.4;
    if (eltrigger.hasAttribute("basic-reveal")) {
      return `top-=${eltriggerHeight}px bottom`;
    }
    return "top bottom";
  },
  pinnedContainer: ".section_pin",
  // markers: true,
  onEnter: (elements, triggers) => {
    const animateItems = [];

    elements.forEach((element) => {
      if (element.hasAttribute("basic-reveal")) {
        animateItems.push(element);
      }
      if (element.hasAttribute("para-reveal")) {
        // console.log("para", element);
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
      scaleY: 1,
      stagger: 0.07,
      duration: 1.5,
      ease: "power4.inOut",
    });
  },
});

liveReload();
