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

(function playPauseVideo() {
  const videos = document.querySelectorAll(".auto_video");

  videos.forEach((video) => {
    video.muted = true;

    const isScrollTriggered = video.hasAttribute("scroll-triggered");
    const isScrollOffset = video.hasAttribute("scroll-offset");
    const scrollOffset = video.getAttribute("scroll-offset");

    // Store original sources for restoration
    if (!video.dataset.originalSources) {
      const sources = video.querySelectorAll("source");
      const sourcesData = Array.from(sources).map((source) => ({
        src: source.src,
        type: source.type,
        media: source.media || "",
      }));
      video.dataset.originalSources = JSON.stringify(sourcesData);
    }

    let DefaultOffset = 0;

    if (scrollOffset) {
      DefaultOffset = parseInt(scrollOffset);
    }

    console.log("DefaultOffset", DefaultOffset);

    if (isScrollTriggered) {
      ScrollTrigger.create({
        trigger: video,
        start: `top+=${DefaultOffset}px bottom`,
        end: `bottom+=${DefaultOffset}px top`,
        pinnedContainer: isScrollOffset ? undefined : ".section_wpr",
        // markers: true,
        onEnter: () => {
          // Video is in view - restore sources and auto-play after load
          console.log("play");
          restoreVideoSources(video);
        },
        onLeave: () => {
          // Video is out of view - pause and clean sources
          console.log("pause");
          video.pause();
          clearAllVideoSources(video);
        },
        onEnterBack: () => {
          // Video is back in view when scrolling up
          console.log("play");
          restoreVideoSources(video);
        },
        onLeaveBack: () => {
          // Video is out of view when scrolling up
          console.log("pause");
          video.pause();
          clearAllVideoSources(video);
        },
      });
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Video is in view - restore sources and auto-play after load
              console.log("play");
              restoreVideoSources(video);
            } else {
              // Video is out of view - pause and clean sources
              console.log("pause");
              video.pause();
              clearAllVideoSources(video);
            }
          });
        },
        { threshold: 0, rootMargin: "200px" },
      );

      observer.observe(video);
    }
  });
})();

function clearAllVideoSources(video) {
  // Remove src attribute from video element
  video.removeAttribute("src");

  // Clear all source elements
  const sources = video.querySelectorAll("source");
  sources.forEach((source) => {
    source.removeAttribute("src");
  });

  // Trigger load to release resources
  video.load();
}

function restoreVideoSources(video) {
  if (!video.dataset.originalSources) return;

  const sourcesData = JSON.parse(video.dataset.originalSources);
  const sources = video.querySelectorAll("source");

  sources.forEach((source, index) => {
    if (sourcesData[index]) {
      source.src = sourcesData[index].src;
      source.type = sourcesData[index].type;
      if (sourcesData[index].media) {
        source.media = sourcesData[index].media;
      }
    }
  });

  // Reload the video with new sources
  video.load();

  // Wait for the video to be ready before playing
  const onLoaded = () => {
    video.play().catch((err) => console.log("Error playing video:", err));
    video.removeEventListener("loadeddata", onLoaded);
  };

  video.addEventListener("loadeddata", onLoaded);
}

(function pricing_toggle_init() {
  const pricing_card = document.querySelectorAll("[pricing-card]");

  pricing_card.forEach((card) => {
    const pricing_toggle = card.querySelector("[pricing-toggle]");
    const pricing_toggle_dot = card.querySelector("[pricing-toggle-dot]");
    const pricing_number = card.querySelector(".pricing-number");
    const monthly_pricing = card.getAttribute("monthly-pricing");
    const yearly_pricing = card.getAttribute("yearly-pricing");
    const billed_text = card.querySelector("[billed-text]");

    if (!pricing_toggle || !pricing_number) return;

    let isMonthly = false;

    // Keep prefix/suffix (e.g. "$", "/mo") and only count the numeric part.
    function parseParts(value) {
      const match = String(value).match(/-?[\d.,]+/);
      if (!match) return { prefix: "", number: 0, suffix: "", decimals: 0 };
      const numStr = match[0].replace(/,/g, "");
      const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
      return {
        prefix: String(value).slice(0, match.index),
        number: parseFloat(numStr),
        suffix: String(value).slice(match.index + match[0].length),
        decimals,
      };
    }

    const counter = { value: parseParts(yearly_pricing).number };

    function countTo(value) {
      const { prefix, number, suffix, decimals } = parseParts(value);
      gsap.to(counter, {
        value: number,
        duration: 0.3,
        ease: "power2.out",
        onUpdate: () => {
          pricing_number.textContent =
            prefix + counter.value.toFixed(decimals) + suffix;
        },
      });
    }

    pricing_toggle.addEventListener("click", () => {
      isMonthly = !isMonthly;

      billed_text.textContent = isMonthly ? "Billed Month" : "Billed Yearly";

      gsap.to(pricing_toggle_dot, {
        x: isMonthly ? -12 : 0,
        duration: 0.2,
        ease: "power2.inOut",
      });

      countTo(isMonthly ? monthly_pricing : yearly_pricing);
    });
  });
})();

(function btn_rotate_init() {
  const btn_rotate = document.querySelectorAll("[btn-rotate]");

  btn_rotate.forEach((btn) => {
    const btn_rotate_icon = btn.querySelector("[btn-rotate-icon]");
    const btn_rotate_tl = gsap
      .timeline({
        paused: true,
        defaults: {
          duration: 0.5,
          ease: "power2.inOut",
        },
      })
      .to(btn_rotate_icon, {
        rotate: 180,
        duration: 1,
        ease: "power3.inOut",
      });

    btn.addEventListener("mouseenter", () => {
      if (btn_rotate_tl.isActive()) {
        return;
      }
      btn_rotate_tl.restart();
    });
  });
})();

(function shimmer_details_init() {
  const shimmer_details = document.querySelectorAll("[shimmer-details]");
  if (!shimmer_details.length) return;

  const STEP = 3; // seconds between each shimmer trigger
  const SWEEP = 0.9; // shimmer stripe sweep duration
  const FADE = 0.4; // crossfade duration

  const items = Array.from(shimmer_details).map((shimmer) => {
    const content = shimmer.querySelector("[shimmer-content]");
    const active = shimmer.querySelector("[shimmer-content-active]");

    // Inject the glowing stripe that sweeps across the detail.
    shimmer.style.position ||= "relative";
    shimmer.style.overflow = "hidden";

    const stripe = document.createElement("div");
    Object.assign(stripe.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "40%",
      height: "100%",
      pointerEvents: "none",
      background:
        "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.65) 50%, transparent 100%)",
      zIndex: "2",
    });
    shimmer.appendChild(stripe);

    gsap.set(stripe, { xPercent: -120, autoAlpha: 0 });
    gsap.set(content, { autoAlpha: 1 });
    gsap.set(active, { autoAlpha: 0 });

    return { content, active, stripe };
  });

  const contents = items.map((i) => i.content);
  const actives = items.map((i) => i.active);

  const tl = gsap.timeline({ repeat: -1, repeatDelay: STEP });

  items.forEach(({ content, active, stripe }, i) => {
    const at = i * STEP;

    tl.to(stripe, { autoAlpha: 1, duration: 0.15 }, at)
      .fromTo(
        stripe,
        { xPercent: -120 },
        { xPercent: 260, duration: SWEEP, ease: "power2.inOut" },
        at,
      )
      .to(stripe, { autoAlpha: 0, duration: 0.15 }, at + SWEEP - 0.15)
      // crossfade to the active state once the stripe has passed
      .to(content, { autoAlpha: 0, duration: FADE }, at + SWEEP * 0.7)
      .to(active, { autoAlpha: 1, duration: FADE }, at + SWEEP * 0.7);
  });

  // After the last one, crossfade everything back to the inactive state,
  // then the loop restarts from the first.
  const resetAt = items.length * STEP;
  tl.to(actives, { autoAlpha: 0, duration: FADE }, resetAt).to(
    contents,
    { autoAlpha: 1, duration: FADE },
    resetAt,
  );
})();

liveReload();

/* iPhone 14 Pro */
