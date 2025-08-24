import { roll, getDevices, lenisInit } from "../utils.js";
import { liveReload } from "../liveReload.js";

const { isDesktop, isMobile } = getDevices();

const lenis = lenisInit(0.15);

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

  // const menu_tl = gsap.timeline({
  //   paused: true,
  //   defaults: {
  //     duration: 0.3,
  //     ease: "power3.inOut",
  //   },
  // });

  // const nav_items_tl = gsap.timeline({
  //   paused: true,
  //   defaults: {
  //     ease: "power4.inOut",
  //   },
  // });

  // menu_tl
  //   .to(".menu_line.top", { y: "6.5px" })
  //   .to(".menu_line.bottom", { y: "-6.5px" }, "<")
  //   .to(".menu_line.top", { rotate: 225, width: "82%", duration: 0.5 })
  //   .to(".menu_line.bottom", { rotate: -45, width: "82%" }, "<")
  //   .fromTo(
  //     ".navigation_wrapper",
  //     { y: "-100%" },
  //     { y: "0%", duration: 2 },
  //     "-=1.3"
  //   );

  // nav_items_tl.fromTo(
  //   ".nav_animate .nav_item",
  //   {
  //     y: "150%",
  //     opacity: 0,
  //     scaleY: 2,
  //     transformOrigin: "top",
  //   },
  //   {
  //     y: "0%",
  //     opacity: 1,
  //     scaleY: 1,
  //     stagger: 0.07,
  //     delay: 0.4,
  //     duration: 1.3,
  //   }
  // );

  // const menu_trigger = document.querySelector(".menu_trigger");

  // menu_trigger?.addEventListener("click", () => {
  //   if (!isMenuOpen) {
  //     menu_tl.play();
  //     // Only play nav_items_tl if it's not already playing or active
  //     if (!nav_items_tl.isActive()) {
  //       nav_items_tl.play(0);
  //     } // always play forward
  //   } else {
  //     menu_tl.reverse();
  //     // Don't reverse nav_items_tl (skip it)
  //   }
  //   isMenuOpen = !isMenuOpen;
  // });
}

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

(function faq_init() {
  const faq_items = document.querySelectorAll(".faq_item");
  let activeIndex = null;
  const timelines = [];

  faq_items.forEach((faqItem, index) => {
    faqItem.isActive = false;
    const faqTl = faqTimeline(faqItem);
    timelines[index] = faqTl;

    faqItem.addEventListener("click", () => {
      if (!faqItem.isActive) {
        // Close any open item
        if (activeIndex !== null && activeIndex !== index) {
          timelines[activeIndex].reverse();
          faq_items[activeIndex].isActive = false;
        }
        faqTl.play();
        faqItem.isActive = true;
        activeIndex = index;
      } else {
        faqTl.reverse();
        faqItem.isActive = false;
        activeIndex = null;
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
          duration: 0.4,
          ease: "power3.inOut",
        },
        onReverseComplete: () => {
          lenis.resize();
          ScrollTrigger.refresh();
        },
      })
      .to(
        faqItem,
        {
          borderRadius: "6px",
        },
        0
      )
      .fromTo(
        faqItem.querySelector(".faq_body"),
        {
          height: 0,
        },
        {
          height: "auto",
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
        },
        0
      )
      .to(
        faqItem.querySelectorAll(".faq_icon"),
        {
          rotate: -180,
        },
        0
      );

    return faqTl;
  }
})();

liveReload();
