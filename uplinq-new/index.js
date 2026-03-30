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

document.querySelectorAll(".btn").forEach((btn) => {
  const btnTl = gsap.timeline({
    paused: true,
    defaults: {
      duration: 0.5,
      ease: "power4.inOut",
    },
  });

  // Set the button's minWidth to its current offsetWidth so it can't shrink smaller
  btn.style.minWidth = btn.offsetWidth + "px";

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

console.log("uplinq-new");

liveReload();
