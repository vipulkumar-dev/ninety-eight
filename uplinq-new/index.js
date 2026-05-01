import { roll, getDevices } from "../utils.js";
import { liveReload } from "../liveReload.js";
import { lenisInit } from "../utils.js";

const { isDesktop, isMobile } = getDevices();

const lenis = lenisInit(0.15);

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
        0,
      )
      .to(
        faqItem.querySelector(".faq_body"),
        {
          height: "auto",
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
        },
        0,
      )
      .to(
        faqItem.querySelectorAll(".faq_icon"),
        {
          rotate: -180,
        },
        0,
      );

    return faqTl;
  }
})();

(function menu_animation_desktop() {
  const container = document.querySelector("[data-navigation-container]");
  const navLinks = document.querySelectorAll("[data-nav-link]");
  const navHideElements = document.querySelectorAll("[data-nav-hide]");
  const header = document.querySelector("[data-element='header']");

  console.log("container", container);

  let currentWpr = null;
  let isAnimating = false;
  let dir = null;

  function getWpr(name) {
    return document.querySelector(`[data-navigation-wpr="${name}"]`);
  }

  function openPanel(name, incoming_dir) {
    const targetWpr = getWpr(name);
    if (!targetWpr) return;

    const targetHeight = targetWpr.offsetHeight;
    console.log("targetHeight", targetHeight);

    if (currentWpr && currentWpr !== targetWpr) {
      // Switching between panels — cross-fade with slide
      const outgoingWpr = currentWpr;
      gsap.set(outgoingWpr, { pointerEvents: "none" });

      gsap.to(outgoingWpr, {
        opacity: 0,
        x: incoming_dir === "l" ? 20 : -20,
        filter: "blur(2px)",
        duration: 0.3,
        ease: "power3.inout",
        onComplete: () => {
          gsap.set(outgoingWpr, {
            x: 0,
            filter: "blur(0px)",
          });
        },
      });

      gsap.set(targetWpr, {
        opacity: 0,
        x: incoming_dir === "l" ? -10 : 10,
        filter: "blur(2px)",
        pointerEvents: "auto",
      });

      gsap.to(targetWpr, {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        duration: 0.3,
        ease: "power3.inOut",
      });

      // Animate container height
      gsap.to(container, {
        height: targetHeight,
        duration: 0.5,
        ease: "power3.inOut",
      });
    } else if (!currentWpr) {
      // Opening from closed
      gsap.set(container, { height: 0, opacity: 0 });
      gsap.set(targetWpr, {
        display: "block",
        opacity: 0,
        x: 0,
        filter: "blur(2px)",
        pointerEvents: "auto",
      });

      gsap.to(container, {
        height: targetHeight,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
      });

      gsap.to(targetWpr, {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.3,
        ease: "power3.out",
        delay: 0.1,
      });
    }

    currentWpr = targetWpr;
  }

  function closePanel() {
    if (!currentWpr) return;
    const outgoingWpr = currentWpr;
    gsap.set(outgoingWpr, { pointerEvents: "none" });

    gsap.to(container, {
      height: 0,
      opacity: 0,
      duration: 0.5,
      ease: "power3.inOut",
    });

    gsap.to(outgoingWpr, {
      opacity: 0,
      filter: "blur(2px)",
      duration: 0.3,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.set(outgoingWpr, { filter: "blur(0px)" });
      },
    });

    currentWpr = null;
    dir = null;
  }

  // Init — hide all wprs and collapse container
  document.querySelectorAll("[data-navigation-wpr]").forEach((wpr) => {
    gsap.set(wpr, { opacity: 0, pointerEvents: "none" });
  });
  gsap.set(container, { height: 0, opacity: 0, overflow: "hidden" });

  // Nav link hover
  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      const name = this.getAttribute("data-nav-link");
      const targetWpr = getWpr(name);
      if (!targetWpr) return;

      // Determine direction
      let incoming_dir = null;
      if (currentWpr && currentWpr !== targetWpr) {
        const links = Array.from(navLinks);
        const currentName = currentWpr.getAttribute("data-navigation-wpr");
        const currentIndex = links.findIndex(
          (l) => l.getAttribute("data-nav-link") === currentName,
        );
        const targetIndex = links.findIndex(
          (l) => l.getAttribute("data-nav-link") === name,
        );
        incoming_dir = currentIndex > targetIndex ? "r" : "l";
      }

      dir = incoming_dir;
      openPanel(name, incoming_dir);
    });
  });

  // Close on header mouseleave
  header.addEventListener("mouseleave", function () {
    closePanel();
  });

  // Hide panel when hovering specific nav hide triggers
  navHideElements.forEach((element) => {
    element.addEventListener("mouseenter", function () {
      closePanel();
    });
  });
})();

document.querySelectorAll(".btn").forEach((btn) => {
  const btnTl = gsap.timeline({
    paused: true,
    defaults: {
      duration: 0.5,
      ease: "power4.inOut",
    },
  });

  // Set the button's minWidth to its current offsetWidth so it can't shrink smaller
  btn.style.minWidth = btn.offsetWidth + 1 + "px";

  btnTl.to(
    btn.querySelector(".right-icon"),
    {
      width: "0px",
      marginRight: "0px",
      opacity: 0,
      rotate: 90,
      filter: "blur(6px)",
      scale: 0,
      x: "-2.5em",
    },
    0,
  );
  btnTl.fromTo(
    btn.querySelector(".left-icon"),
    {
      filter: "blur(6px)",
      opacity: 0,
      scale: 0,
      rotate: -45,
      x: "2.5em",
    },
    {
      width: "0.625em",
      x: 0,
      scale: 1,
      marginLeft: "1em",
      opacity: 1,
      rotate: 45,
      filter: "blur(0px)",
    },
    0,
  );

  btn.addEventListener("mouseenter", () => {
    btnTl.play();
  });
  btn.addEventListener("mouseleave", () => {
    btnTl.reverse();
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

const isLoader = false;

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
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scaleY: 1,
          stagger: 0.08,
          duration: (index, target) => {
            if (target.hasAttribute("extra-time")) {
              return 1.3;
            }
            return 0.8;
          },
          ease: "power3.inOut",
        });
      },
    },
  );
}

if (isLoader) {
  setTimeout(() => {
    initReveal();
  }, 3000);
} else {
  initReveal();
}

console.log("uplinq-new");

liveReload();
