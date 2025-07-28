import { roll, getDevices } from "../utils.js";
import { liveReload } from "../liveReload.js";

const { isDesktop, isMobile } = getDevices();

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
          // console.log("para", element);
          element.querySelectorAll(".para_line").forEach((line) => {
            animateItems.push(line);
          });
        }
        if (element.hasAttribute("word-reveal")) {
          // console.log("word", element);
          element.querySelectorAll(".para_word").forEach((word) => {
            console.log("word", word);
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
}

if (isLoader) {
  setTimeout(() => {
    initReveal();
  }, 6000);
} else {
  initReveal();
}

gsap.to("[loading-animation]", {
  opacity: 0,
  duration: 0.4,
  delay: 6.1,
  ease: "power2.inOut",
});

liveReload();
