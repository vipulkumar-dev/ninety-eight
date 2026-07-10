import { roll, getDevices, lenisInit } from "../utils.js";
import { liveReload } from "../liveReload.js";

const { isDesktop, isMobile } = getDevices();

// Smooth scroll + wire Lenis to ScrollTrigger so scrub animations update.
// const lenis = lenisInit();

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

(function heroVideoSwiper() {
  const heroVideo = document.querySelector(".hero-video");

  function getSlideVideoLink(slide) {
    return slide?.getAttribute("videolink") || slide?.dataset?.videolink || "";
  }

  function getSlidePoster(slide) {
    const img = slide?.querySelector(".hero-slide-image, img");
    return img?.currentSrc || img?.src || "";
  }

  function setHeroVideo(src, poster) {
    const source = heroVideo.querySelector("source");
    const currentSrc =
      source?.getAttribute("src") || heroVideo.getAttribute("src");

    if (poster) heroVideo.poster = poster;

    if (currentSrc === src) {
      heroVideo.loop = false;
      if (heroVideo.paused) heroVideo.play().catch(() => {});
      return;
    }

    if (source) {
      source.src = src;
    } else {
      heroVideo.src = src;
    }

    heroVideo.loop = false;
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    heroVideo.load();
    heroVideo.play().catch(() => {});
  }

  document.querySelectorAll(".swiper").forEach((swiperEl) => {
    const hasVideoSlides = swiperEl.querySelector(
      "[videolink], [data-videolink]",
    );
    const linkVideo = heroVideo && hasVideoSlides;

    function syncVideo(swiper) {
      const slide = swiper.slides[swiper.activeIndex];
      const link = getSlideVideoLink(slide);
      if (!link) return;
      setHeroVideo(link, getSlidePoster(slide));
    }

    const swiperInstance = new Swiper(swiperEl, {
      direction: "horizontal",
      slidesPerView: "auto",
      spaceBetween: 16,
      centeredSlides: true,
      centeredSlidesBounds: true,
      slideToClickedSlide: true,
      loop: true,
      grabCursor: true,
      on: linkVideo
        ? {
            init: syncVideo,
            slideChange: syncVideo,
          }
        : undefined,
    });

    if (linkVideo) {
      heroVideo.addEventListener("ended", () => swiperInstance.slideNext());
    }
  });
})();

(function faq_init() {
  const faq_items = document.querySelectorAll(".faq-item");
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
        faqItem.querySelectorAll(".icon-plus"),
        {
          opacity: 0,
        },
        0,
      )
      .to(
        faqItem.querySelectorAll(".icon-minus"),
        {
          opacity: 1,
        },
        0,
      );

    return faqTl;
  }
})();

liveReload();

/* iPhone 14 Pro */
