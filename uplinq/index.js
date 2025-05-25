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
// var scriptLocation = document.currentScript.src;
// console.log("scriptLocation", scriptLocation);

document.querySelectorAll(".btn").forEach((btn) => {
  const btn_tl = gsap.timeline({
    paused: true,
    defaults: {
      duration: 0.3,
      ease: "power3.inOut",
    },
  });

  btn_tl.to(
    btn.querySelectorAll(".arrow_line"),
    {
      x: "0%",
    },
    0
  );

  btn_tl.to(
    btn.querySelector("svg"),
    {
      x: "0px",
    },
    0
  );

  // btn_tl.to(
  //   btn.querySelector(".btn_bg_path"),
  //   {
  //     duration: 1,
  //     // morphSVG:
  //     //   "M8 0.5H257C261.142 0.5 264.5 3.85786 264.5 8V55C264.5 59.1421 261.142 62.5 257 62.5H8.16504C4.05427 62.4998 0.709905 59.1906 0.666016 55.0801L0.5 39.4951V8L0.509766 7.61426C0.710536 3.65139 3.98724 0.5 8 0.5Z",

  //     fill: "white",
  //     ease: "power4.inOut",
  //   },
  //   0
  // );

  // btn_tl.to(
  //   btn,
  //   {
  //     duration: 1,
  //     // morphSVG:
  //     //   "M8 0.5H257C261.142 0.5 264.5 3.85786 264.5 8V55C264.5 59.1421 261.142 62.5 257 62.5H8.16504C4.05427 62.4998 0.709905 59.1906 0.666016 55.0801L0.5 39.4951V8L0.509766 7.61426C0.710536 3.65139 3.98724 0.5 8 0.5Z",

  //     color: "black",
  //     ease: "power4.inOut",
  //   },
  //   0
  // );

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
    slidesPerView: "auto",
    spaceBetween: 16,
    centeredSlides: true,
    centeredSlidesBounds: true,
    autoplay: {
      delay: 3000,
    },
    loop: true,
    navigation: {
      nextEl: document.querySelector(".swiper_next"),
      prevEl: document.querySelector(".swiper_prev"),
    },
  });
});

liveReload();
