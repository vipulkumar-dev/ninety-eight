import { roll, getDevices, lenisInit } from "../utils.js";
import { liveReload } from "../liveReload.js";

// Force scroll to top immediately
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

try {
  const lottie = Webflow.require("lottie");
  lottie.lottie.setQuality("low");
} catch (err) {
  console.warn("Lottie not found, animations may not work as expected.");
}

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
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }

    if (window.scrollY > 100) {
      header.classList.add("active");
    } else {
      header.classList.remove("active");
    }
  });
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

let hoverTimeout;
let isFirstHover = true;

document.querySelectorAll(".backed_item").forEach((item, _, allItems) => {
  item.addEventListener("mouseenter", () => {
    // Clear any existing timeout
    clearTimeout(hoverTimeout);

    // Add delay only for first hover
    const delay = isFirstHover ? 100 : 0;

    hoverTimeout = setTimeout(() => {
      allItems.forEach((el) => {
        if (el !== item) {
          el.classList.add("unactive");
          el.classList.remove("active");
        } else {
          el.classList.add("active");
          el.classList.remove("unactive");
        }
      });

      gsap.fromTo(
        item.querySelector(".backed_label"),
        {
          y: 15,
          scale: 0,
          transformOrigin: "center bottom",
          filter: "blur(15px)",
          opacity: 0,
          rotate: "-20deg",
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          transformOrigin: "center bottom",
          filter: "blur(0px)",
          rotate: "0deg",
          duration: 0.4,
          ease: "power4.inOut",
        }
      );

      // Mark that first hover is done
      isFirstHover = false;
      console.log("Mouse entered:", item);
    }, delay);
  });
});

document.querySelectorAll("[backed-wpr]").forEach((wrapper) => {
  wrapper.addEventListener("mouseleave", () => {
    // Clear timeout on mouseleave
    clearTimeout(hoverTimeout);

    // Reset first hover state
    isFirstHover = true;

    document.querySelectorAll(".backed_item").forEach((el) => {
      el.classList.remove("active", "unactive");
    });
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

const isLoader = true;

function initReveal() {
  ScrollTrigger.batch(
    "[basic-reveal],[fade-reveal],[para-reveal],[word-reveal]",
    {
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
          y: "0%",
          opacity: 1,
          stagger: 0.06,
          duration: (index, target) => {
            if (target.hasAttribute("extra-time")) {
              return 1.6;
            }
            return 1;
          },
          ease: "power4.inOut",
        });
      },
    }
  );
}

if (isLoader) {
  setTimeout(() => {
    initReveal();
  }, 3000);
} else {
  initReveal();
}

gsap.to("[loading-animation]", {
  opacity: 0,
  filter: "blur(1px)",
  duration: 0.7,
  delay: 3,
  ease: "power4.inOut",
});

// gsap.to(".loading_bg", {
//   opacity: 1,
//   duration: 0.7,
//   ease: "power4.inOut",
// });

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
      .to(
        faqItem.querySelector(".faq_body"),
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
