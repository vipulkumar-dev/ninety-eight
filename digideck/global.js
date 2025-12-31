import { roll, getDevices } from "../utils.js";
import { liveReload } from "../liveReload.js";

const { isDesktop, isMobile } = getDevices();

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

(function mouse_follow_init() {
  if (!isDesktop) return;
  const mouse_follow_containers = document.querySelectorAll(
    "[mouse-follow-container]"
  );

  mouse_follow_containers.forEach((mouse_follow_container) => {
    const mouse_follow_item = mouse_follow_container.querySelector(
      "[mouse-follow-item]"
    );

    if (!mouse_follow_item) return;

    // Parse data-x attribute (default: -50, 30)
    const dataX = mouse_follow_item.getAttribute("strength-x");
    const xRange = dataX ? parseFloat(dataX.trim()) : 20;

    // Parse data-y attribute (default: -50, 30)
    const dataY = mouse_follow_item.getAttribute("strength-y");
    const yRange = dataY ? parseFloat(dataY.trim()) : 10;

    const mouse_follow_item_width = mouse_follow_item.offsetWidth;
    const mouse_follow_item_height = mouse_follow_item.offsetHeight;

    mouse_follow_container.addEventListener("mousemove", (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const mapped_x = gsap.utils.mapRange(
        0,
        mouse_follow_item_width,
        -xRange,
        xRange,
        x
      );

      const mapped_y = gsap.utils.mapRange(
        0,
        mouse_follow_item_height,
        -yRange,
        yRange,
        y
      );

      gsap.to(mouse_follow_item, {
        x: mapped_x,
        y: mapped_y,
        duration: 0.3,
      });
    });
  });
})();

document.querySelectorAll(".swiper").forEach((swiper) => {
  const swiperInstance = new Swiper(swiper, {
    direction: "horizontal",
    slidesPerView: 3,
    spaceBetween: 16,
    centeredSlides: true,
    centeredSlidesBounds: true,
    speed: 500,
    grabCursor: true,
    autoplay: {
      delay: 4000,
    },
    loop: true,
    navigation: {
      nextEl: document.querySelector(".swiper_next"),
      prevEl: document.querySelector(".swiper_prev"),
    },
  });
});

let isSports = false;
document
  .querySelector("[toggle-mode-container]")
  .addEventListener("click", () => {
    isSports = !isSports;
    handleMode(isSports);
  });

const gsapDefault = {
  duration: 0.6,
  ease: "power4.inOut",
};

function handleMode(isSports) {
  if (isSports) {
    gsap.to("[toggle-mode-trigger]", {
      x: "100%",
      ...gsapDefault,
    });
    gsap.to("[toggle-mode-trigger-content]", {
      x: "-50%",
      ...gsapDefault,
    });
  } else {
    gsap.to("[toggle-mode-trigger]", {
      x: "0%",
      ...gsapDefault,
    });
    gsap.to("[toggle-mode-trigger-content]", {
      x: "0%",
      ...gsapDefault,
    });
  }
}

console.log("Digideck");

roll("[roll]", 45);

liveReload();
