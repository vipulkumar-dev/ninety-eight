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

(function popup_init() {
  const popupTriggers = document.querySelectorAll("[popup-trigger]");
  const closeTriggers = document.querySelectorAll("[popup-close]");

  const popup_animation = gsap.timeline({
    paused: true,
    defaults: {
      duration: 0.8,
      ease: "power4.inOut",
    },
  });

  popup_animation
    .to(
      ".popup_wpr",
      {
        autoAlpha: 1,
        pointerEvents: "auto",
      },
      0
    )
    .to(
      [".close_area"],
      {
        backdropFilter: "blur(30px)",
        backgroundColor: "rgba(13, 12, 16, 0.8)",
      },
      0
    )
    .from(
      "[popup-content]",
      {
        scale: 0.9,
      },
      0
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

document.querySelectorAll("[para-reveal]").forEach((text) => {
  new SplitText(text, {
    type: "lines",
    deepslice: true,
    // mask: "lines",
    linesClass: "para_line",
  });
});

document.querySelectorAll("[word-reveal]").forEach((text) => {
  new SplitText(text, {
    type: "words",
    deepslice: true,
    // mask: "lines",
    wordsClass: "para_word",
  });
});

gsap.set("[para-reveal]", {
  opacity: 1,
});

gsap.set("[word-reveal]", {
  opacity: 1,
});

(function tabAnimation() {
  const tabs = document.querySelectorAll(".tabs");
  ScrollTrigger.create({
    trigger: ".tab_wpr",
    start: "center center",
    end: "+=1200px",
    pin: true,
    // markers: true,
    onUpdate: (self) => {
      const totalTabs = tabs.length;
      if (totalTabs === 0) return;

      const progress = self.progress;

      // Use a non-linear mapping: less scroll for first and last tab
      let activeIndex;
      if (progress < 0.15) {
        activeIndex = 0;
      } else if (progress > 0.85) {
        activeIndex = totalTabs - 1;
      } else {
        // Spread the rest evenly
        activeIndex = Math.round(
          1 + ((progress - 0.15) / 0.7) * (totalTabs - 2)
        );
      }

      activeIndex = Math.max(0, Math.min(totalTabs - 1, activeIndex));

      tabs.forEach((tab, idx) => {
        if (idx === activeIndex) {
          tab.classList.add("active");
          tab.click();
        } else {
          tab.classList.remove("active");
        }
      });
    },
  });
})();

function initReveal() {
  ScrollTrigger.batch(
    "[basic-reveal],[fade-reveal],[para-reveal],[word-reveal]",
    {
      start: "top bottom",
      end: "top bottom",
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
          if (element.hasAttribute("word-reveal")) {
            // console.log("word", element);
            element.querySelectorAll(".para_word").forEach((word) => {
              // console.log("word", word);
              animateItems.push(word);
            });
          }
          if (element.hasAttribute("fade-reveal")) {
            animateItems.push(element);
          }
        });
        // console.log("animateItems", animateItems);

        gsap.to(animateItems, {
          filter: "blur(0px)",
          opacity: 1,
          stagger: 0.05,
          duration: (index, target) => {
            if (target.hasAttribute("extra-time")) {
              return 1.6;
            }
            if (target.hasAttribute("extra-more-time")) {
              return 2.3;
            }
            return 1.2;
          },
          ease: "power3.inOut",
        });
      },
    }
  );
}

initReveal();

liveReload();
