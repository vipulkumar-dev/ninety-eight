import { roll, getDevices, lenisInit } from "../utils.js";
import { liveReload } from "../liveReload.js";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

(function scrollResotration() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  // Prevent scroll restoration
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.addEventListener("load", () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);
  });
})();

(function initNavItemScroll() {
  document.querySelectorAll(".nav_item").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const targetId = link.getAttribute("data-href"); // e.g. "#section"
      const targetEl = document.querySelector(`${targetId}`);
      console.log(targetEl);

      if (targetEl) {
        gsap.to(window, {
          duration: 1,
          scrollTo: targetEl,
          ease: "power2.inOut",
        });
      }
      console.log("nav link clicked");
    });
  });
})();

const { isDesktop, isMobile } = getDevices();

// const lenis = lenisInit(0.15);

const header = document.getElementById("header");
if (header) {
  let isMenuOpen = false;
  let lastScrollPosition = 0;
  let delta = isDesktop ? 70 : 100; // Minimum scroll distance before toggling header
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
}

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
          // lenis.resize();
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

(function tabAnimation() {
  const tabs = document.querySelectorAll(".tabs");
  ScrollTrigger.create({
    trigger: ".tab_wpr",
    start: "center center",
    end: "+=1500px",
    pin: ".section_wpr",
    onUpdate: (self) => {
      const totalTabs = tabs.length;
      if (totalTabs === 0) return;

      const progress = self.progress;

      let activeIndex;
      if (progress < 0.1) {
        activeIndex = 0;
      } else if (progress > 0.9) {
        activeIndex = totalTabs - 1;
      } else {
        // Spread the rest evenly
        activeIndex = Math.round(
          1 + ((progress - 0.1) / 0.9) * (totalTabs - 2)
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

// Split lines for [para-reveal] and words for [word-reveal], then set initial opacity
["para-reveal", "word-reveal"].forEach((attr) => {
  document.querySelectorAll(`[${attr}]`).forEach((el) => {
    new SplitText(el, {
      type: attr === "para-reveal" ? "lines" : "words",
      deepslice: true,
      linesClass: attr === "para-reveal" ? "para_line" : undefined,
      wordsClass: attr === "word-reveal" ? "para_word" : undefined,
    });
    gsap.set(el, { opacity: 1 });
  });
});

function initReveal() {
  ScrollTrigger.batch(
    "[basic-reveal],[fade-reveal],[para-reveal],[word-reveal]",
    {
      start: "top bottom",
      end: "top bottom",
      anticipatePin: 1,
      // pinnedContainer: ".section_wpr",
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
              return 1.3;
            }
            if (target.hasAttribute("extra-more-time")) {
              return 2;
            }
            return 1;
          },
          ease: "power3.inOut",
        });
      },
    }
  );
}

initReveal();

const riveWebflow = rive;
const riveUrl =
  "https://cdn.prod.website-files.com/68a9961590783e9b6cea126c/68b1ed3e7bf01948caf00579_hero.riv";

function createRiveInstance(
  container,
  url = riveUrl,
  artboard = "main",
  stateMachine = "State Machine 1"
) {
  const riveInstance = new riveWebflow.Rive({
    src: url,
    canvas: container,
    artboard,
    layout: new riveWebflow.Layout({
      fit: "cover",
      alignment: "center",
    }),
    stateMachines: stateMachine,
    autoplay: false,
    isTouchScrollEnabled: true,

    onLoad: () => {
      riveInstance.resizeDrawingSurfaceToCanvas(); // This fixes the blur!
    },
  });

  return riveInstance;
}

setTimeout(() => {
  document.querySelectorAll("[data-rive-canvas]").forEach((el) => {
    const artboard = el.getAttribute("artboard");
    const stateMachine = el.getAttribute("state-machine");
    const riveAnimation = createRiveInstance(
      el,
      riveUrl,
      artboard,
      stateMachine
    );

    const riveContainer = el;
    // Play only when in view using Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            riveAnimation.play();
            console.log("Rive animation played");
          } else {
            riveAnimation.pause();
            console.log("Rive animation paused");
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(riveContainer);
  });
}, 2500);

liveReload();
