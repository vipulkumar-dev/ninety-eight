import { roll, getDevices, lenisInit } from "../utils.js";
import { liveReload } from "../liveReload.js";

const { isDesktop, isMobile } = getDevices();
const lenis = lenisInit(0.15);

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
      duration: 0.8,
      ease: "power4.inOut",
    });
  });

  btn.addEventListener("mouseleave", () => {
    gsap.to(btn.querySelectorAll(".btn_char-mask"), {
      y: "0%",
      stagger: 0.07,
      duration: 0.8,
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

(function faq_init() {
  const faq_wprs = document.querySelectorAll(".faq_wpr");

  faq_wprs.forEach((faq_wpr, index) => {
    const faq_items = faq_wpr.querySelectorAll(".faq_item");
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
  const elements = document.querySelectorAll(
    "[basic-reveal],[fade-reveal],[para-reveal],[word-reveal]"
  );

  elements.forEach((element) => {
    let startValue = element.hasAttribute("bottom-100")
      ? "top 100%"
      : "top 85%"; // default

    ScrollTrigger.create({
      trigger: element,
      start: startValue,
      end: startValue,
      anticipatePin: 1,
      // markers: true,
      onEnter: () => {
        const animateItems = [];

        if (element.hasAttribute("basic-reveal")) {
          animateItems.push(element);
        }
        if (element.hasAttribute("para-reveal")) {
          element.querySelectorAll(".para_line").forEach((line) => {
            animateItems.push(line);
          });
        }
        if (element.hasAttribute("word-reveal")) {
          element.querySelectorAll(".para_word").forEach((word) => {
            animateItems.push(word);
          });
        }
        if (element.hasAttribute("fade-reveal")) {
          animateItems.push(element);
        }

        gsap.to(animateItems, {
          y: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 1,
          delay: (index, target) => {
            if (target.hasAttribute("extra-time")) return 0.1;
            if (target.hasAttribute("extra-more-time")) return 0.2;
            return 0;
          },
          ease: "power4.inOut",
        });
      },
    });
  });
}

initReveal();

const webflowLottie = Webflow.require("lottie").lottie;
webflowLottie.setQuality("low");

const allAnimations = webflowLottie.getRegisteredAnimations();

// Function to handle Lottie animation visibility
function handleLottieVisibility() {
  // Create intersection observer options
  const options = {
    root: null, // use viewport as root
    rootMargin: "0px",
    threshold: 0.5, // trigger when at least 10% of the element is visible
  };

  // Create observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Find the Lottie animation for this element
      const animation = allAnimations.find(
        (anim) => anim.wrapper === entry.target
      );

      if (animation) {
        if (entry.isIntersecting) {
          // Play animation when in view
          animation.play();
        } else {
          // Pause animation when out of view
          animation.pause();
        }
      }
    });
  }, options);

  // Observe each Lottie animation wrapper
  allAnimations.forEach((animation) => {
    if (animation.wrapper) {
      observer.observe(animation.wrapper);
    }
  });
}

// Initialize the Lottie visibility handling
handleLottieVisibility();

liveReload();
