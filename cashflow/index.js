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

liveReload();
